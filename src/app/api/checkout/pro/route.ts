import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
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
    console.error(error);
    return NextResponse.json({ message: "Erro ao ativar plano PRO" }, { status: 500 });
  }
}
