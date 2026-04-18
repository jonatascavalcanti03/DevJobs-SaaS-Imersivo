import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    if (userRole !== "CANDIDATE") {
      return NextResponse.json({ message: "Apenas candidatos podem se aplicar." }, { status: 403 });
    }

    const { jobId, coverLetter } = await req.json();

    if (!jobId) {
      return NextResponse.json({ message: "Job ID é obrigatório." }, { status: 400 });
    }

    // Verifica se a vaga existe
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== "ACTIVE") {
      return NextResponse.json({ message: "Vaga não encontrada ou inativa." }, { status: 404 });
    }

    // Verifica se já se candidatou
    const existingApp = await prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId }
      }
    });

    if (existingApp) {
      return NextResponse.json({ message: "Você já se candidatou a esta vaga." }, { status: 400 });
    }

    // Cria a candidatura
    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        coverLetter: coverLetter || null,
        status: "PENDING"
      }
    });

    return NextResponse.json({ message: "Candidatura enviada com sucesso!", application }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao aplicar para vaga:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    if (userRole === "CANDIDATE") {
      // Retornar candidaturas do candidato
      const apps = await prisma.application.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              title: true,
              company: true,
              companyLogo: true,
              location: true,
              type: true
            }
          }
        },
        orderBy: { appliedAt: 'desc' }
      });
      return NextResponse.json(apps, { status: 200 });
    } else if (userRole === "COMPANY") {
      // Retornar candidaturas para as vagas dessa empresa
      const { searchParams } = new URL(req.url);
      const limit = searchParams.get("limit");

      const apps = await prisma.application.findMany({
        where: {
          job: {
            authorId: userId
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              title: true,
              image: true,
              skills: true,
              resume: true,
              linkedin: true,
              portfolio: true
            }
          },
          job: {
            select: {
              title: true,
            }
          }
        },
        orderBy: { appliedAt: 'desc' },
        take: limit ? parseInt(limit) : undefined
      });
      return NextResponse.json(apps, { status: 200 });
    }

    return NextResponse.json({ message: "Role inválida" }, { status: 403 });
  } catch (error) {
    console.error("Erro ao listar candidaturas:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
