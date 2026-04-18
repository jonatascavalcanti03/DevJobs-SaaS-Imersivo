import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const applicationId = params.id;

    if (userRole !== "COMPANY") {
      return NextResponse.json({ message: "Apenas empresas podem atualizar candidaturas." }, { status: 403 });
    }

    const { status } = await req.json();

    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ message: "Status inválido." }, { status: 400 });
    }

    // Verifica se a candidatura existe e pertence a uma vaga do usuário logado
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      return NextResponse.json({ message: "Candidatura não encontrada." }, { status: 404 });
    }

    if (application.job.authorId !== userId) {
      return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
    }

    // Atualiza o status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    return NextResponse.json({ message: "Status atualizado com sucesso!", application: updatedApplication }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar candidatura:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
