import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with demo data...");

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Create a Company
  const company = await prisma.user.upsert({
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
  console.log(`Company created: ${company.email}`);

  // 2. Create a Candidate
  const candidate = await prisma.user.upsert({
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
  console.log(`Candidate created: ${candidate.email}`);

  // 3. Create some Jobs
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
      authorId: company.id,
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
      authorId: company.id,
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
      authorId: company.id,
    }
  ];

  for (const job of jobs) {
    const createdJob = await prisma.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: job as any,
    });
    console.log(`Job created: ${createdJob.title}`);
    
    // Add an application for the first job
    if (job.level === 'SENIOR') {
      await prisma.application.upsert({
        where: {
          userId_jobId: {
            userId: candidate.id,
            jobId: createdJob.id,
          }
        },
        update: {},
        create: {
          userId: candidate.id,
          jobId: createdJob.id,
          status: 'PENDING'
        }
      });
      console.log(`Application created for job: ${createdJob.title}`);
    }
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
