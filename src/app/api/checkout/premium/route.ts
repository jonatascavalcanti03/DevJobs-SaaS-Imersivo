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
      data: { premiumCredits: { increment: 1 } },
    });

    return NextResponse.json({ message: "Crédito Premium adicionado!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao adicionar crédito" }, { status: 500 });
  }
}
