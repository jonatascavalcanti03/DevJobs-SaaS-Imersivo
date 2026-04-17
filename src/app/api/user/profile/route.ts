import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        title: body.title,
        bio: body.bio,
        linkedin: body.linkedin,
        github: body.github,
        portfolio: body.portfolio,
        skills: body.skills ? JSON.stringify(body.skills) : undefined,
        resume: body.resume, // string base64 do pdf
        image: body.image,   // string base64 da foto
      },
    });

    return NextResponse.json({ message: "Perfil atualizado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        title: true,
        bio: true,
        linkedin: true,
        github: true,
        portfolio: true,
        skills: true,
        resume: true,
        image: true,
      }
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
