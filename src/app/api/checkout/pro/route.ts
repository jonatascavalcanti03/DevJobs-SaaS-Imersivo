import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
      "http://localhost:3001";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Plano DevJobs PRO (Mensal)",
              description:
                "Perfil destacado, candidaturas priorizadas e acesso a vagas exclusivas por 30 dias.",
            },
            unit_amount: 2900, // R$ 29,00
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: (session.user as any).id,
        plan: "PRO",
      },
      success_url: `${origin}/candidato/pro?success=true`,
      cancel_url: `${origin}/candidato/pro?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Erro no checkout PRO:", error);
    return NextResponse.json({ message: "Erro ao iniciar checkout PRO" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await prisma.user.update({
      where: { id: userId },
      data: { 
        isPro: true, 
        proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 dias
      },
    });

    return NextResponse.json({ message: "Plano PRO ativado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao ativar PRO:", error);
    return NextResponse.json({ message: "Erro ao ativar plano PRO" }, { status: 500 });
  }
}
