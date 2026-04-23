import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { query, location } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Critério de busca é obrigatório" }, { status: 400 });
    }

    // Apenas candidatos PRO podem criar alertas (regra de negócio)
    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true, activePlan: true }
    });


    if (!user?.isPro && user?.activePlan !== "PRO") {
       return NextResponse.json({ 
         error: "Funcionalidade exclusiva para Candidatos PRO",
         requiresUpgrade: true 
       }, { status: 403 });
    }

    // Cria o alerta
    const alert = await prisma.jobAlert.create({
      data: {
        userId: (session.user as any).id,
        query,
        location: location || null,
        active: true
      }
    });


    return NextResponse.json({ 
      success: true, 
      message: "Alerta criado com sucesso! Você será notificado por e-mail.",
      alert 
    });
  } catch (error: any) {
    console.error("Erro ao criar alerta de vaga:", error);
    return NextResponse.json({ error: "Erro interno ao processar alerta" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const alerts = await prisma.jobAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });


    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar alertas" }, { status: 500 });
  }
}
