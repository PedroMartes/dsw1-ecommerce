import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validação básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 });
    }

    // 2. Verificar se o usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    // 3. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Salvar no MySQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT", // Por padrão, cria como cliente
      },
    });

    return NextResponse.json({ message: "Usuário criado!", userId: user.id }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}