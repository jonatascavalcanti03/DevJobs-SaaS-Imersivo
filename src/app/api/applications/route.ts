import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── Calcula match score real entre skills do candidato e tags da vaga ──
function calcMatchScore(candidateSkills: string | null, jobTags: string): number {
  if (!candidateSkills) return 40;

  let skills: string[] = [];
  let tags: string[] = [];

  try { skills = JSON.parse(candidateSkills).map((s: string) => s.toLowerCase().trim()); } catch {
    skills = candidateSkills.split(",").map((s) => s.toLowerCase().trim());
  }
  try { tags = JSON.parse(jobTags).map((t: string) => t.toLowerCase().trim()); } catch {
    tags = jobTags.split(",").map((t) => t.toLowerCase().trim());
  }

  if (!tags.length) return 50;

  const matches = tags.filter((tag) =>
    skills.some((skill) => skill.includes(tag) || tag.includes(skill))
  ).length;

  const raw = Math.round((matches / tags.length) * 100);
  return Math.min(99, Math.max(30, raw));
}

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

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== "ACTIVE") {
      return NextResponse.json({ message: "Vaga não encontrada ou inativa." }, { status: 404 });
    }

    const existingApp = await prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existingApp) {
      return NextResponse.json({ message: "Você já se candidatou a esta vaga." }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: { userId, jobId, coverLetter: coverLetter || null, status: "PENDING" },
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
      const apps = await prisma.application.findMany({
        where: { userId },
        include: {
          job: {
            select: { title: true, company: true, companyLogo: true, location: true, type: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });
      return NextResponse.json(apps, { status: 200 });
    }

    if (userRole === "COMPANY") {
      const { searchParams } = new URL(req.url);
      const limit = searchParams.get("limit");

      const apps = await prisma.application.findMany({
        where: { job: { authorId: userId } },
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
              portfolio: true,
              isPro: true,
              proExpiresAt: true,
              isVerified: true,
            },
          },
          job: {
            select: { title: true, tags: true },
          },
        },
        orderBy: { appliedAt: "desc" },
        take: limit ? parseInt(limit) : undefined,
      });

      // Adiciona match score real e verifica expiração do PRO
      const now = new Date();
      const enriched = apps.map((app) => {
        const isPro =
          app.user.isPro &&
          (!app.user.proExpiresAt || new Date(app.user.proExpiresAt) > now);

        const matchScore = calcMatchScore(app.user.skills, app.job.tags);

        return { ...app, user: { ...app.user, isPro }, matchScore };
      });

      // PRO candidatos vêm primeiro, depois por match score decrescente
      enriched.sort((a, b) => {
        if (a.user.isPro && !b.user.isPro) return -1;
        if (!a.user.isPro && b.user.isPro) return 1;
        return b.matchScore - a.matchScore;
      });

      return NextResponse.json(enriched, { status: 200 });
    }

    return NextResponse.json({ message: "Role inválida" }, { status: 403 });
  } catch (error) {
    console.error("Erro ao listar candidaturas:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
