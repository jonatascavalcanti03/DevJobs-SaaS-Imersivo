# 📚 Documentação Técnica Corporativa - DevJobs SaaS

Esta documentação fornece uma visão detalhada da arquitetura, modelagem de dados e implementações técnicas (incluindo o recém-integrado Assistente de Inteligência Artificial) do projeto **DevJobs SaaS**.

---

## 1. Visão Geral do Sistema

O **DevJobs** é uma plataforma SaaS (Software as a Service) desenvolvida para otimizar o processo de recrutamento no mercado de tecnologia. A plataforma possui dois fluxos principais de usuários, devidamente isolados através de RBAC (Role-Based Access Control):

*   **Candidatos (`CANDIDATE`):** Podem buscar vagas (com integração de IA e busca textual), favoritar oportunidades, configurar alertas e realizar candidaturas simplificadas em "1 clique".
*   **Empresas / Recrutadores (`COMPANY`):** Podem publicar vagas, gerenciar currículos e visualizar o "Match" dos candidatos usando painéis administrativos customizados.

---

## 2. Arquitetura e Stack Tecnológica

A arquitetura foi desenhada para ser altamente escalável, utilizando renderização híbrida e rotas de API serverless.

### Frontend & Backend (Monolito Serverless)
*   **Framework:** Next.js 16 (App Router)
*   **Linguagem:** TypeScript (Strict Mode)
*   **Estilização:** Tailwind CSS v4, Framer Motion (para micro-interações) e UI Components (Lucide).
*   **Padrão de Autenticação:** NextAuth.js (v4) integrado ao Prisma Adapter. Suporte a credenciais com Bcrypt e OAuth.

### Inteligência Artificial (DevJobs AI)
*   **SDK:** Vercel AI SDK (`@ai-sdk/react` e `ai`)
*   **LLM Provider:** OpenAI (`@ai-sdk/openai`), utilizando o modelo `gpt-4o-mini` para baixa latência.
*   **Tool Calling:** Agentic AI configurado para acessar dados estruturados através de _tools_ parametrizadas pelo Zod, realizando buscas diretamente no banco de dados.

### Banco de Dados & ORM
*   **Banco de Dados:** PostgreSQL hospedado (compatível com plataformas cloud como Aiven, Supabase ou Vercel Postgres).
*   **ORM:** Prisma ORM, garantindo tipagem de ponta a ponta e migrations seguras.

### Pagamentos e Assinaturas
*   **Gateway:** Stripe API
*   **Webhooks:** Gerenciamento do ciclo de vida de assinaturas (Planos PRO para candidatos e Corporativo para empresas).

---

## 3. Integração de Inteligência Artificial (DevJobs Chat)

A plataforma conta com um agente de IA nativo (`/chat`), desenhado para auxiliar desenvolvedores em sua jornada e recomendar vagas.

### Arquitetura do Agente
1.  **Interface de Usuário:** O componente `<DevJobsChat />` gerencia o estado da conversa local e o streaming de texto usando a hook `useChat` do Vercel AI SDK.
2.  **Rota de API (`/api/chat/route.ts`):** Rota POST otimizada para tempo máximo de execução (`maxDuration = 30`), responsável por inicializar a _system prompt_ e o stream.
3.  **Tool `searchJobs`:** A IA possui a habilidade autônoma de decidir quando invocar a função `searchJobs`. Ao ser acionada, ela extrai parâmetros do texto do usuário, consulta o banco de dados via Prisma (`prisma.job.findMany`) procurando correspondência textual (no título e descrição) das vagas ativas, e as devolve formatadas na conversa.

---

## 4. Modelagem de Dados (Prisma Schema)

O esquema relacional é otimizado para leituras rápidas, com os seguintes domínios principais:

### 4.1 Entidade `User`
Tabela central unificada. Utiliza campos anuláveis (nullable) para acomodar diferentes regras dependendo do campo `role`:
*   **Candidato:** `resume`, `skills`, `github`, `linkedin`, `isPro`.
*   **Empresa:** `companyName`, `companyLogo`, `isVerified`, `premiumCredits`.

### 4.2 Entidade `Job`
Armazena a publicação de vagas.
*   Contém links para a empresa (`authorId`).
*   Campos como `slug`, `location`, `type` (Remote/Onsite), `level` e controle de expiração/pagamento (`isPremium`, `stripePaymentId`).
*   Indexação em colunas chave (como `status` e `isPremium`) para ganho de performance nas _queries_ de busca.

### 4.3 Entidade `Application`
A tabela de pivô (ManyToMany) que conecta `User` e `Job`.
*   Registra a data da aplicação, a _cover letter_ do candidato e o `status` atualizado pela empresa (PENDING, ACCEPTED, REJECTED).
*   Garante através de constraints de unicidade (`@@unique([userId, jobId])`) que o usuário não faça múltiplas aplicações na mesma vaga.

### 4.4 Entidades Auxiliares
*   **`JobAlert`:** Queries de busca salvas pelo usuário para notificações futuras.
*   **`SavedJob`:** Lista de desejos (bookmarks) dos candidatos.
*   **Tabelas NextAuth:** `Account`, `Session`, `VerificationToken` controlam de ponta-a-ponta a gestão segura de chaves e expiração de acessos.

---

## 5. Próximos Passos (Roadmap de Evolução)

1.  **Dashboard de Telemetria:** Adição de métricas detalhadas de conversão (Visualizações vs. Candidaturas) para as empresas.
2.  **Match de IA Avançado:** Expansão do Agent atual para cruzar o currículo do candidato (extraído em texto plano do `resume`) contra a tabela `Job`, gerando um Score de Afinidade em tempo real durante a visualização da vaga.
3.  **Processamento de Background:** Desacoplamento do envio de e-mails de notificação (Job Alerts) para uma fila de processamento assíncrona.
