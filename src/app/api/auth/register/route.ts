import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Apenas roles válidas que o front pode enviar
const ALLOWED_ROLES = ["CANDIDATE", "COMPANY"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // ── Validação de campos ───────────────────────────────────
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // Sanitiza o nome
    const cleanName = String(name).trim();
    if (cleanName.length < 2) {
      return NextResponse.json(
        { message: "Nome deve ter pelo menos 2 caracteres." },
        { status: 400 }
      );
    }

    // Valida email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "E-mail inválido." },
        { status: 400 }
      );
    }

    // Valida senha mínima (segurança)
    if (String(password).length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    // ── Sanitiza role (previne injeção de ADMIN pelo cliente) ─
    if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
      return NextResponse.json(
        { message: "Tipo de conta inválido." },
        { status: 400 }
      );
    }

    // ── Verifica duplicidade de email ─────────────────────────
    const userExists = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // ── Hash da senha ─────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12); // custo 12 = mais seguro

    // ── Cria o usuário ────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: String(email).toLowerCase().trim(),
        password: hashedPassword,
        role: role as AllowedRole,
      },
    });

    // Remove senha do retorno por segurança
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Conta criada com sucesso!", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar conta." },
      { status: 500 }
    );
  }
}
