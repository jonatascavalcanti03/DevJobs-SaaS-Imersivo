import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import JobDetailsClient from "./JobDetailsClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    select: { title: true, company: true, location: true }
  });

  if (!job) return { title: "Vaga não encontrada" };

  return {
    title: `${job.title} na ${job.company} | Match.js`,
    description: `Candidate-se para a vaga de ${job.title} na empresa ${job.company} em ${job.location}. Encontre as melhores oportunidades tech no Match.js.`,
    openGraph: {
      title: `${job.title} - ${job.company}`,
      description: `Vaga de programador em ${job.location}. Confira os detalhes e envie seu currículo!`,
      images: [`/api/og?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`],
    },
  };
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
