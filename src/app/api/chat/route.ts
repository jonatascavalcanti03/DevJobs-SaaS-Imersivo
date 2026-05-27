import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const maxDuration = 30; // Allow up to 30 seconds for the request

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: "Você é um assistente virtual do DevJobs, uma plataforma SaaS de vagas de emprego. Seu objetivo é ajudar desenvolvedores a encontrar vagas, dar dicas de carreira e tirar dúvidas sobre a plataforma. Seja amigável e conciso. SEMPRE que o usuário perguntar sobre vagas, use a ferramenta 'searchJobs' para buscar no banco de dados real do DevJobs e recomende as vagas retornadas. Inclua o título, a empresa, a localização e diga que a vaga pode ser encontrada na plataforma.",
      tools: {
        searchJobs: tool({
          description: 'Busca vagas de emprego reais no banco de dados do DevJobs. Pode filtrar por termo de busca (título, descrição).',
          parameters: z.object({
            query: z.string().optional().describe('Termo de busca para a vaga, ex: "React", "Frontend", "Estágio". Se não fornecido, retorna vagas gerais.'),
          }),
          execute: async ({ query }) => {
            const jobs = await prisma.job.findMany({
              where: query ? {
                status: 'ACTIVE',
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                ]
              } : {
                status: 'ACTIVE'
              },
              take: 5,
              select: {
                title: true,
                company: true,
                location: true,
                level: true,
                slug: true,
              }
            });
            return { jobs };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Erro na API de Chat:', error);
    return new Response('Ocorreu um erro ao processar a requisição.', { status: 500 });
  }
}
