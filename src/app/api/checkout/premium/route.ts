import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

// Este endpoint é chamado APÓS o Stripe confirmar o pagamento de uma vaga premium.
// Deve ser acionado pelo webhook do Stripe em produção.
// Em desenvolvimento, pode ser chamado diretamente após o redirect de success_url.

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: "ID da vaga não informado." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3001";

    // Cria sessão Stripe para destacar a vaga
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Vaga Destaque Premium — DevJobs.br",
              description:
                "Sua vaga aparece no topo dos resultados por 30 dias com badge especial.",
            },
            unit_amount: 14900, // R$ 149,00 por vaga em destaque
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        jobId,
        type: "PREMIUM_JOB",
      },
      success_url: `${baseUrl}/empresa/vagas?premiumSuccess=true&jobId=${jobId}`,
      cancel_url: `${baseUrl}/empresa/vagas?premiumCanceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Erro no checkout premium de vaga:", error?.message || error);
    return NextResponse.json(
      { message: "Erro ao iniciar pagamento premium." },
      { status: 500 }
    );
  }
}

// Chamado após confirmação (redirect de success_url) para atualizar o banco
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: "ID da vaga não informado." },
        { status: 400 }
      );
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
      },
    });

    return NextResponse.json(
      { message: "Vaga destacada com sucesso!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao ativar vaga premium:", error?.message || error);
    return NextResponse.json(
      { message: "Erro ao ativar destaque da vaga." },
      { status: 500 }
    );
  }
}
