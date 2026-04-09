import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function getUserFromToken(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Para rotas da API (server-side)
      token = request.cookies.get("zetta_token")?.value;
    } else {
      // Para componentes do cliente (client-side)
      const cookieStore = await cookies();
      token = cookieStore.get("zetta_token")?.value;
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}