// ============================================================
// CHATBOT TEMPORARIAMENTE INATIVO
// ============================================================
// Motivo: Chave de API OpenAI precisa ser reconfigurada.
// O chatbot será reativado em uma atualização futura.
//
// Para reativar:
// 1. Gerar nova OPENAI_API_KEY em https://platform.openai.com
// 2. Atualizar a variável no .env e na Vercel
// 3. Descomentar o código abaixo e remover a resposta de manutenção
// ============================================================

// import { openai } from '@ai-sdk/openai';
// import { streamText, tool } from 'ai';
// import { z } from 'zod';
// import { prisma } from '@/lib/prisma';

// export const maxDuration = 30;

export async function POST() {
  return Response.json(
    {
      message: 'O assistente DevJobs está temporariamente inativo para manutenção e melhorias. Volte em breve!',
      status: 'maintenance',
    },
    { status: 503 }
  );
}

// --- CÓDIGO ORIGINAL (descomentar quando reativar) ---
//
// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//
//     const result = streamText({
//       model: openai('gpt-4o-mini'),
//       messages,
//       system: "Você é um assistente virtual do DevJobs...",
//       tools: {
//         searchJobs: tool({
//           description: 'Busca vagas de emprego reais no banco de dados do DevJobs.',
//           parameters: z.object({
//             query: z.string().optional().describe('Termo de busca para a vaga'),
//           }),
//           execute: async ({ query }) => {
//             const jobs = await prisma.job.findMany({
//               where: query ? {
//                 status: 'ACTIVE',
//                 OR: [
//                   { title: { contains: query, mode: 'insensitive' } },
//                   { description: { contains: query, mode: 'insensitive' } },
//                 ]
//               } : {
//                 status: 'ACTIVE'
//               },
//               take: 5,
//               select: {
//                 title: true,
//                 company: true,
//                 location: true,
//                 level: true,
//                 slug: true,
//               }
//             });
//             return { jobs };
//           },
//         }),
//       },
//     });
//
//     return result.toDataStreamResponse();
//   } catch (error) {
//     console.error('Erro na API de Chat:', error);
//     return new Response('Ocorreu um erro ao processar a requisição.', { status: 500 });
//   }
// }
