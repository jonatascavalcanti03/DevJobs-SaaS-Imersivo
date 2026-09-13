import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const companyData = [
  ['Tech Corp Brasil', 'Tecnologia e produtos digitais para empresas brasileiras.', 'techcorp@devjobs.br'],
  ['InnovaTech', 'Produtos de inteligência artificial para transformar negócios.', 'innovatech@devjobs.br'],
  ['Nuvem Labs', 'Engenharia de software cloud-native para times modernos.', 'nuvemlabs@devjobs.br'],
  ['Fintech Aurora', 'Soluções financeiras simples, seguras e acessíveis.', 'aurora@devjobs.br'],
  ['HealthCode', 'Tecnologia para melhorar a experiência na saúde.', 'healthcode@devjobs.br'],
  ['Pixel Studio', 'Estúdio digital focado em experiências web memoráveis.', 'pixel@devjobs.br'],
  ['LogiFlow', 'Plataforma inteligente para logística e mobilidade.', 'logiflow@devjobs.br'],
  ['EducaTech', 'Ferramentas digitais para ampliar o acesso à educação.', 'educatech@devjobs.br'],
  ['Verde Digital', 'Tecnologia e dados a favor de um futuro sustentável.', 'verde@devjobs.br'],
  ['Orbit Systems', 'Infraestrutura e software para negócios em escala.', 'orbit@devjobs.br'],
];

const candidateData = [
  ['João Silva', 'joao@devjobs.br', 'Desenvolvedor Full Stack', 'React, Node.js, TypeScript, Next.js'],
  ['Maria Oliveira', 'maria@devjobs.br', 'Engenheira de Dados', 'Python, SQL, Spark, AWS'],
  ['Carlos Souza', 'carlos@devjobs.br', 'Desenvolvedor Mobile', 'React Native, Swift, TypeScript'],
  ['Ana Costa', 'ana@devjobs.br', 'Desenvolvedora Frontend', 'Vue.js, JavaScript, CSS, Figma'],
  ['Rafael Santos', 'rafael@devjobs.br', 'Desenvolvedor Backend', 'Java, Spring Boot, PostgreSQL, Docker'],
  ['Beatriz Lima', 'beatriz@devjobs.br', 'Estudante de Engenharia de Software', 'HTML, CSS, JavaScript, Git'],
  ['Lucas Martins', 'lucas@devjobs.br', 'DevOps Engineer', 'AWS, Kubernetes, Terraform, Linux'],
  ['Juliana Alves', 'juliana@devjobs.br', 'QA Engineer', 'Cypress, Playwright, Testes de API'],
  ['Pedro Rocha', 'pedro@devjobs.br', 'Desenvolvedor Python', 'Python, Django, FastAPI, Redis'],
  ['Camila Ferreira', 'camila@devjobs.br', 'Product Designer', 'Figma, UX Research, Design Systems'],
];

const jobData = [
  ['Desenvolvedor Frontend Sênior', 'React, Next.js, TailwindCSS', 'SENIOR', 'REMOTE', 10000, 15000],
  ['Engenheiro de Software Backend', 'Node.js, PostgreSQL, Docker', 'MID', 'HYBRID', 8000, 12000],
  ['Estágio em Desenvolvimento Web', 'HTML, CSS, JavaScript', 'INTERN', 'REMOTE', 1500, 2200],
  ['Engenheiro de Dados', 'Python, Spark, AWS, SQL', 'SENIOR', 'REMOTE', 12000, 18000],
  ['Desenvolvedor Mobile React Native', 'React Native, TypeScript, Expo', 'MID', 'ONSITE', 7000, 11000],
  ['Estágio em QA e Automação', 'Cypress, Playwright, Git', 'INTERN', 'HYBRID', 1400, 2000],
  ['Desenvolvedor Java Júnior', 'Java, Spring Boot, PostgreSQL', 'JUNIOR', 'HYBRID', 4500, 6500],
  ['DevOps Engineer', 'AWS, Kubernetes, Terraform', 'SENIOR', 'REMOTE', 11000, 17000],
  ['Desenvolvedor Python Pleno', 'Python, Django, FastAPI', 'MID', 'REMOTE', 7500, 11500],
  ['Estágio em Produto e Tecnologia', 'Figma, UX, JavaScript', 'INTERN', 'ONSITE', 1600, 2400],
] as const;

async function main() {
  console.log('Criando dados demonstrativos do DevJobs...');
  const password = await bcrypt.hash('123456', 10);
  const companies = [];
  const candidates = [];

  for (const [index, [name, about, email]] of companyData.entries()) {
    const company = await prisma.user.upsert({
      where: { email },
      update: { name, companyName: name, companyAbout: about, role: 'COMPANY' },
      create: {
        email,
        name,
        password,
        role: 'COMPANY',
        companyName: name,
        companyAbout: about,
        companySize: index % 3 === 0 ? 'Grande empresa' : 'Média empresa',
        image: `https://images.unsplash.com/photo-${['1549923746-c502d488b3ea', '1568992687947-868a62a9f521', '1497366811353-6870744d04b2'][index % 3]}?w=150&h=150&fit=crop`,
      },
    });
    companies.push(company);
  }

  for (const [index, [name, email, title, skills]] of candidateData.entries()) {
    const candidate = await prisma.user.upsert({
      where: { email },
      update: { name, title, skills: JSON.stringify(skills.split(', ')) },
      create: {
        email,
        name,
        password,
        role: 'CANDIDATE',
        title,
        bio: `Profissional apaixonado por tecnologia e desenvolvimento de produtos digitais.`,
        skills: JSON.stringify(skills.split(', ')),
        image: `https://i.pravatar.cc/150?img=${index + 11}`,
        isPro: index % 4 === 1,
      },
    });
    candidates.push(candidate);
  }

  for (const [index, [title, tags, level, type, salaryMin, salaryMax]] of jobData.entries()) {
    const company = companies[index % companies.length];
    const slug = `${title}-${company.companyName}-${index}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const job = await prisma.job.upsert({
      where: { slug },
      update: { title, description: `Faça parte da equipe da ${company.companyName} e ajude a construir produtos digitais que fazem a diferença.`, status: 'ACTIVE' },
      create: {
        title,
        slug,
        company: company.companyName || company.name,
        companyLogo: company.image,
        location: type === 'REMOTE' ? 'Remoto' : index % 2 === 0 ? 'São Paulo (SP)' : 'Belo Horizonte (MG)',
        description: `Faça parte da equipe da ${company.companyName} e ajude a construir produtos digitais que fazem a diferença. Buscamos pessoas colaborativas, curiosas e interessadas em crescer com o time.`,
        type,
        level,
        salaryMin,
        salaryMax,
        tags: JSON.stringify(tags.split(', ')),
        benefits: JSON.stringify(['Vale-refeição', 'Plano de saúde', 'Horário flexível']),
        status: 'ACTIVE',
        isPremium: index < 2,
        authorId: company.id,
      },
    });
    await prisma.application.upsert({
      where: { userId_jobId: { userId: candidates[index].id, jobId: job.id } },
      update: {},
      create: { userId: candidates[index].id, jobId: job.id, status: index % 3 === 0 ? 'ACCEPTED' : 'PENDING' },
    });
  }

  console.log('10 empresas, 10 candidatos e 10 vagas criados com sucesso.');
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
