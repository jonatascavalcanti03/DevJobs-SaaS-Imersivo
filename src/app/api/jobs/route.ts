import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Função utilitária para gerar slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Substitui espaços por -
    .replace(/[^\w\-]+/g, '')       // Remove todos os caracteres não-palavra
    .replace(/\-\-+/g, '-')         // Substitui múltiplos - por um único -
    .replace(/^-+/, '')             // Remove - do início
    .replace(/-+$/, '');            // Remove - do final
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    if (userRole !== "COMPANY") {
      return NextResponse.json({ message: "Apenas empresas podem criar vagas." }, { status: 403 });
    }

    const body = await req.json();

    // Buscar dados da empresa logada
    const companyUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyName: true, image: true, name: true }
    });

    const companyName = companyUser?.companyName || companyUser?.name || "Empresa Confidencial";
    const companyLogo = companyUser?.image || null;

    // Gerar um slug único para a vaga
    let slug = slugify(`${body.title} ${companyName}`);
    // Verificar se já existe (simplificado, idealmente um loop)
    const existingJob = await prisma.job.findUnique({ where: { slug } });
    if (existingJob) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Criar a vaga no banco de dados
    const job = await prisma.job.create({
      data: {
        title: body.title,
        slug: slug,
        description: body.description,
        company: companyName,
        companyLogo: companyLogo,
        location: body.location || "Remoto",
        type: body.type,
        level: body.level,
        salaryMin: body.salaryMin ? parseInt(body.salaryMin.replace(/\D/g, "")) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax.replace(/\D/g, "")) : null,
        tags: body.tags || "[]",
        status: "ACTIVE", // Por padrão criamos como ativa, ou DRAFT
        isPremium: body.isPremium || false,
        authorId: userId,
      }
    });

    return NextResponse.json({ message: "Vaga criada com sucesso!", job }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get("authorId");
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (authorId) whereClause.authorId = authorId;
    if (status && status !== "ALL") whereClause.status = status;

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { applications: true },
        },
      },
      // Vagas premium sempre no topo, depois por data
      orderBy: [{ isPremium: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

