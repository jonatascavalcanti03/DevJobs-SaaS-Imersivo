import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import JobDetailsClient from "./JobDetailsClient";

interface Props {
  params: { id: string };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  
  // Busca a vaga pelo ID
  const job = await prisma.job.findUnique({
    where: { id }
  });

  if (!job) {
    return notFound();
  }

  // Incrementa as visualizações (simples, idealmente faríamos via API ou debounced)
  await prisma.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } }
  });

  // Para passar pro client, precisamos serializar
  const serializedJob = {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };

  return <JobDetailsClient job={serializedJob} />;
}
