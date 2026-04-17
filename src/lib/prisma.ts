import { PrismaClient } from "@prisma/client";

// Evita que o Next.js instancie múltiplos clientes do Prisma durante o desenvolvimento
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
