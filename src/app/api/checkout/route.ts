import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── Planos com preços e benefícios ─────────────────────────────
const PLANS = {
  Essencial: {
    monthly: 29700,   // R$ 297,00
    annual: 284400,   // R$ 2.844,00 (R$ 237/mês × 12)
    annualBonus: "4 vagas destaque/mês (bônus anual +1)",
    label: "Plano Essencial",
    dbPlan: "ESSENCIAL",
    maxDestaque: 3,   // vagas destaque por mês
  },
  "Corporativo PRO": {
    monthly: 89700,   // R$ 897,00
    annual: 860400,   // R$ 8.604,00 (R$ 717/mês × 12)
    annualBonus: "Gerente de conta dedicado + acesso antecipado a recursos",
    label: "Plano Corporativo PRO",
    dbPlan: "CORPORATIVO",
    maxDestaque: null, // ilimitado
  },
} as const;

type PlanKey = keyof typeof PLANS;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { plan, isAnnual } = await req.json();

    const planData = PLANS[plan as PlanKey];
    if (!planData) {
      return NextResponse.json({ message: "Plano inválido." }, { status: 400 });
    }

    const unitAmount = isAnnual ? planData.annual : planData.monthly;
    const periodLabel = isAnnual ? "Anual" : "Mensal";
    const description = isAnnual
      ? `Acesso por 12 meses com 20% de desconto. Bônus: ${planData.annualBonus}`
      : "Acesso mensal, renove quando quiser";

    const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3001";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `${planData.label} (${periodLabel}) — DevJobs.br`,
              description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: (session.user as any).id,
        plan,
        isAnnual: String(isAnnual),
        dbPlan: planData.dbPlan,
      },
      success_url: `${baseUrl}/empresa/premium?success=true&plan=${encodeURIComponent(plan)}&annual=${isAnnual}`,
      cancel_url: `${baseUrl}/empresa/premium?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Erro no checkout da empresa:", error?.message || error);
    return NextResponse.json(
      { message: "Erro ao iniciar pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}

// ── PUT — Ativa o plano no banco após confirmação de pagamento ──
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { plan, isAnnual } = await req.json();
    const planData = PLANS[plan as PlanKey];
    if (!planData) {
      return NextResponse.json({ message: "Plano inválido." }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const daysValid = isAnnual ? 365 : 30;
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        activePlan: planData.dbPlan as any,
        planExpiresAt: expiresAt,
        // Corporativo PRO recebe selo de verificada automaticamente
        isVerified: planData.dbPlan === "CORPORATIVO",
      },
    });

    return NextResponse.json({
      message: `Plano ${planData.label} ativado com sucesso!`,
      expiresAt,
    });
  } catch (error: any) {
    console.error("Erro ao ativar plano empresa:", error?.message || error);
    return NextResponse.json({ message: "Erro ao ativar plano." }, { status: 500 });
  }
}
