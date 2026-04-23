import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggles saving a job
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Faça login para salvar vagas" }, { status: 401 });
    }

    const { jobId, isExternal } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "ID da vaga é obrigatório" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    // Verifica se já está salva
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId: jobId
        }
      }
    });

    if (existing) {
      // Se já existe, remove (unfavorite)
      await prisma.savedJob.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ saved: false, message: "Vaga removida dos favoritos" });
    } else {
      // Se não existe, cria (favorite)
      await prisma.savedJob.create({
        data: {
          userId: (session.user as any).id,
          jobId,
          isExternal: !!isExternal
        }
      });
      return NextResponse.json({ saved: true, message: "Vaga salva com sucesso!" });
    }
  } catch (error) {
    console.error("Erro ao gerenciar vaga salva:", error);
    return NextResponse.json({ error: "Erro interno ao salvar vaga" }, { status: 500 });
  }
}

// Get all saved jobs for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(savedJobs);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar vagas salvas" }, { status: 500 });
  }
}
