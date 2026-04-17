import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica se o email já existe no banco
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // Hash da senha (segurança)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva o usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // CANDIDATE ou COMPANY
      },
    });

    // Remove a senha do objeto de retorno por segurança
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
