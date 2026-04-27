import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // ── Email + Senha ─────────────────────────────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Dados inválidos");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error(
            "Usuário não encontrado ou cadastrado com outro método de login"
          );
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Senha incorreta");
        }

        // Atualiza dados de auditoria de login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "CANDIDATE";
      }

      // Busca role atualizado do banco (para logins OAuth onde role vem do DB)
      if (token.id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "CANDIDATE";
      }

      // Remove imagem do token para não inflar o cookie
      delete token.picture;
      delete token.image;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;

        // Busca dados atualizados do banco
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { image: true, name: true, role: true },
          });
          session.user.image = dbUser?.image ?? null;
          if (dbUser?.name) session.user.name = dbUser.name;
          (session.user as any).role = dbUser?.role ?? token.role;
        }
      }
      return session;
    },
  },
};
