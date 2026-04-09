import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso!" });

  // Para deletar o cookie, nós o sobrescrevemos com uma data de expiração no passado
  response.cookies.set("zetta_token", "", {
    httpOnly: true,
    expires: new Date(0), // Data antiga = deletar imediatamente
    path: "/",
  });

  return response;
}