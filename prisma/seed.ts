import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with MULTIPLE demo data...");

  const passwordHash = await bcrypt.hash("123456", 10);

  // --- COMPANIES ---
  const company1 = await prisma.user.upsert({
    where: { email: 'empresa@devjobs.br' },
    update: {},
    create: {
      email: 'empresa@devjobs.br',
      name: 'Tech Corp Brasil',
      password: passwordHash,
      role: 'COMPANY',
      companyName: 'Tech Corp Brasil',
      companyAbout: 'Uma empresa líder em inovação e tecnologia.',
      image: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop',
    },
  });
  console.log(`Company created: ${company1.email}`);

  const company2 = await prisma.user.upsert({
    where: { email: 'startup@devjobs.br' },
    update: {},
    create: {
      email: 'startup@devjobs.br',
      name: 'InnovaTech',
      password: passwordHash,
      role: 'COMPANY',
      companyName: 'InnovaTech Startups',
      companyAbout: 'Focados em IA e Web3, revolucionando o amanhã.',
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=150&h=150&fit=crop',
    },
  });
  console.log(`Company created: ${company2.email}`);

  // --- CANDIDATES ---
  const candidate1 = await prisma.user.upsert({
    where: { email: 'candidato@devjobs.br' },
    update: {},
    create: {
      email: 'candidato@devjobs.br',
      name: 'João Silva',
      password: passwordHash,
      role: 'CANDIDATE',
      title: 'Desenvolvedor Full Stack',
      bio: 'Apaixonado por React e Node.js.',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Next.js']),
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    },
  });
  console.log(`Candidate created: ${candidate1.email}`);

  const candidate2 = await prisma.user.upsert({
    where: { email: 'candidata2@devjobs.br' },
    update: {},
    create: {
      email: 'candidata2@devjobs.br',
      name: 'Maria Oliveira',
      password: passwordHash,
      role: 'CANDIDATE',
      title: 'Engenheira de Dados',
      bio: 'Foco em Python, Spark e Machine Learning.',
      skills: JSON.stringify(['Python', 'SQL', 'Spark', 'AWS']),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      isPro: true,
    },
  });
  console.log(`Candidate created: ${candidate2.email}`);

  const candidate3 = await prisma.user.upsert({
    where: { email: 'candidato3@devjobs.br' },
    update: {},
    create: {
      email: 'candidato3@devjobs.br',
      name: 'Carlos Souza',
      password: passwordHash,
      role: 'CANDIDATE',
      title: 'Desenvolvedor Mobile Pleno',
      bio: 'Especialista em React Native e iOS.',
      skills: JSON.stringify(['React Native', 'Swift', 'TypeScript']),
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
      isPro: false,
    },
  });
  console.log(`Candidate created: ${candidate3.email}`);

  // --- JOBS ---
  const jobs = [
    {
      title: 'Desenvolvedor Frontend Sênior',
      slug: 'desenvolvedor-frontend-senior-tech-corp',
      company: 'Tech Corp Brasil',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop',
      location: 'São Paulo (SP) ou Remoto',
      description: 'Buscamos um desenvolvedor frontend com muita experiência em React e Tailwind. Trabalhe em projetos inovadores em uma equipe ágil e dinâmica. Vaga remota com excelentes benefícios.',
      type: 'REMOTE',
      level: 'SENIOR',
      salaryMin: 10000,
      salaryMax: 15000,
      tags: JSON.stringify(['React', 'Next.js', 'TailwindCSS']),
      status: 'ACTIVE',
      isPremium: true,
      authorId: company1.id,
    },
    {
      title: 'Engenheiro de Software Backend',
      slug: 'engenheiro-de-software-backend-tech-corp',
      company: 'Tech Corp Brasil',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop',
      location: 'São Paulo (SP)',
      description: 'Vaga para atuar no backend desenvolvendo APIs escaláveis usando Node.js e PostgreSQL. Ambiente de trabalho híbrido em São Paulo.',
      type: 'HYBRID',
      level: 'MID',
      salaryMin: 8000,
      salaryMax: 12000,
      tags: JSON.stringify(['Node.js', 'PostgreSQL', 'Docker']),
      status: 'ACTIVE',
      isPremium: false,
      authorId: company1.id,
    },
    {
      title: 'Estágio em Desenvolvimento Web',
      slug: 'estagio-em-desenvolvimento-web-tech-corp',
      company: 'Tech Corp Brasil',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop',
      location: 'Remoto',
      description: 'Oportunidade para estudantes de tecnologia que desejam aprender e colocar a mão na massa. Aprenda as melhores práticas do mercado e ganhe experiência real.',
      type: 'REMOTE',
      level: 'INTERN',
      salaryMin: 1500,
      salaryMax: 2000,
      tags: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
      status: 'ACTIVE',
      isPremium: false,
      authorId: company1.id,
    },
    {
      title: 'Engenheiro de Dados Sênior',
      slug: 'engenheiro-de-dados-senior-innovatech',
      company: 'InnovaTech Startups',
      companyLogo: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=150&h=150&fit=crop',
      location: 'Remoto',
      description: 'Estruturação de pipelines de dados em larga escala. Conhecimento sólido em Spark e infraestrutura de cloud.',
      type: 'REMOTE',
      level: 'SENIOR',
      salaryMin: 12000,
      salaryMax: 18000,
      tags: JSON.stringify(['Python', 'Spark', 'AWS', 'SQL']),
      status: 'ACTIVE',
      isPremium: true,
      authorId: company2.id,
    },
    {
      title: 'Desenvolvedor Mobile iOS',
      slug: 'desenvolvedor-mobile-ios-innovatech',
      company: 'InnovaTech Startups',
      companyLogo: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=150&h=150&fit=crop',
      location: 'Curitiba (PR)',
      description: 'Venha criar aplicativos nativos que impactam milhares de usuários todos os dias.',
      type: 'ONSITE',
      level: 'MID',
      salaryMin: 7000,
      salaryMax: 11000,
      tags: JSON.stringify(['Swift', 'iOS', 'UI/UX']),
      status: 'ACTIVE',
      isPremium: false,
      authorId: company2.id,
    }
  ];

  for (const job of jobs) {
    const createdJob = await prisma.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: job as any,
    });
    console.log(`Job created: ${createdJob.title}`);
    
    // Add some random applications
    if (job.level === 'SENIOR' && job.company === 'Tech Corp Brasil') {
      await prisma.application.upsert({
        where: {
          userId_jobId: { userId: candidate1.id, jobId: createdJob.id }
        },
        update: {},
        create: { userId: candidate1.id, jobId: createdJob.id, status: 'PENDING' }
      });
      console.log(`Application created: ${candidate1.name} -> ${createdJob.title}`);
    }

    if (job.title.includes('Dados')) {
      await prisma.application.upsert({
        where: {
          userId_jobId: { userId: candidate2.id, jobId: createdJob.id }
        },
        update: {},
        create: { userId: candidate2.id, jobId: createdJob.id, status: 'ACCEPTED' }
      });
      console.log(`Application created: ${candidate2.name} -> ${createdJob.title}`);
    }

    if (job.title.includes('Mobile')) {
      await prisma.application.upsert({
        where: {
          userId_jobId: { userId: candidate3.id, jobId: createdJob.id }
        },
        update: {},
        create: { userId: candidate3.id, jobId: createdJob.id, status: 'REJECTED' }
      });
      console.log(`Application created: ${candidate3.name} -> ${createdJob.title}`);
    }
  }

  console.log("Seeding finished successfully with MULTIPLE users.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
