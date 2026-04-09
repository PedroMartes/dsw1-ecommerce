import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Importar JWT
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // 1. Gerar o Token JWT com os dados do usuário
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "3d" } // Token vale por 1 dia
    );

    // 2. Criar a resposta
    const response = NextResponse.json({
      message: "Login realizado!",
      user: { name: user.name, role: user.role }
    });

    // 3. Salvar o token em um Cookie Seguro (HTTPOnly)
    // Isso impede que hackers roubem o token via scripts no navegador
    response.cookies.set("zetta_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia em segundos
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}