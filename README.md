<div align="center">
  <br />
    <img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
  <br />

  <h1>🚀 DevJobs.br</h1>
  <p>
    <strong>A Plataforma SaaS Premium que conecta os melhores desenvolvedores do Brasil às melhores empresas de tecnologia.</strong>
  </p>
</div>

<br />

## 📖 Sobre o Projeto

O **DevJobs.br** não é apenas mais um portal de vagas. É um **SaaS (Software as a Service)** completo, construído do absoluto zero, focado em entregar uma experiência (UI/UX) de nível mundial tanto para quem busca emprego quanto para as empresas que estão recrutando.

O projeto foi arquitetado para ser rápido, fluido e monetizável, utilizando as tecnologias mais modernas do ecossistema React/Next.js e um sistema de pagamentos robusto com o **Stripe**.

---

## ✨ Principais Funcionalidades

### 🧑‍💻 Para Candidatos
- **Painel Premium (Dashboard):** Visão geral de métricas, candidaturas ativas e vagas recomendadas.
- **Glassmorphism e Micro-interações:** Interface viva, com feedbacks visuais claros e navegação instantânea.
- **Candidatura em 1 Clique:** Sistema de aplicações rápido e integrado ao perfil.
- **Status em Tempo Real:** Acompanhamento visual de aprovações ou rejeições (Pending, Accepted, Rejected).
- **Plano PRO (Em breve):** Destaque visual nas buscas dos recrutadores e selo de desenvolvedor verificado.

### 🏢 Para Empresas (Recrutadores)
- **Criação de Vagas Rápida:** Formulários otimizados para postagem de vagas com formatação rica.
- **Banco de Candidatos Avançado:** Tabela dinâmica com visualização de perfis e métricas.
- **Modal de Perfil do Candidato:** Visualização completa do currículo, links (LinkedIn, Portfólio) e habilidades do candidato sem sair da tela.
- **Planos Corporativos (SaaS):** Compra de planos premium via Stripe para ter acesso a vagas destaque ilimitadas e (futuramente) Match com Inteligência Artificial.

---

## 🛠️ Tecnologias Utilizadas

A stack foi escolhida a dedo para garantir **alta performance, SEO, e segurança**:

* **[Next.js 16/15 (App Router)](https://nextjs.org/):** Framework React de alta performance, utilizando Server Components e rotas dinâmicas.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para um código seguro e escalável.
* **[Tailwind CSS v4](https://tailwindcss.com/):** Estilização utilitária para designs responsivos, adotando temas escuros (Dark Mode) e Efeitos de Vidro (Glassmorphism).
* **[Framer Motion](https://www.framer.com/motion/):** Biblioteca para animações fluidas e transições de página "Soft Navigation".
* **[Prisma ORM](https://www.prisma.io/):** Modelagem de banco de dados e tipagem automática segura.
* **[MySQL](https://www.mysql.com/):** Banco de dados relacional robusto.
* **[NextAuth.js (v4)](https://next-auth.js.org/):** Autenticação segura via credenciais com suporte a OAuth.
* **[Stripe API](https://stripe.com/br):** Gateway de pagamentos internacionais, assinaturas e webhooks.

---

## ⚙️ Como Executar Localmente

Para rodar este projeto na sua máquina, você vai precisar do **Node.js** (v20+), **NPM/Yarn/PNPM**, e um banco de dados **MySQL** rodando.

### 1. Clone o repositório
```bash
git clone https://github.com/jonatascavalcanti03/DevJobs-SaaS-Imersivo.git
cd devjobs-br
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e preencha com as suas chaves:

```env
# URL do seu Banco de Dados MySQL
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Segredo de Autenticação (Gere um com: openssl rand -base64 32)
NEXTAUTH_SECRET="seu-segredo-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Chaves do Stripe (Pegue no seu painel de desenvolvedor do Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Configure o Banco de Dados (Prisma)
Execute as migrações para criar as tabelas no seu banco:
```bash
npx prisma generate
npx prisma db push
```

### 5. Rode o Servidor de Desenvolvimento
```bash
npm run dev
```

Pronto! Acesse o projeto em: `http://localhost:3000`

---

## 🎨 UI & Design System

A interface do DevJobs.br foi desenhada para **surpreender**. As escolhas de paleta de cores trazem um aspecto noturno e elegante (`#0B1121`, `#0F172A`), com destaques em azul turquesa (`#06B6D4`) e roxo (`#6366F1`). 

Foi implementado um uso intensivo de **Bordas Brilhantes (Glow Borders)** em CSS puro e **Cards com desfoque (Backdrop Blur)** para dar sensação de profundidade e tecnologia de ponta.

---

## 👥 Equipe do Projeto

Este projeto foi construído e idealizado com dedicação pela seguinte equipe técnica:

* **Desenvolvedor Full Stack / Engenheiro de Software:**
  * Jônatas Cavalcanti ([@jonatascavalcanti03](https://github.com/jonatascavalcanti03))
* **Analista de Requisitos / Product Owner:**
  * Pedro Henrique Santos ([@pedruhen](https://github.com/pedruhen) | ✉️ pedrohensantos03@gmail.com)

---

<div align="center">
  Desenvolvido com 💙 e muita dedicação por esta equipe.
</div>
