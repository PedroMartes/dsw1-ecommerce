import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Usamos 'jose' porque o Middleware do Next exige

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('zetta_token')?.value;

  // 1. Se tentar entrar em /admin sem token, vai para o login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 2. Verifica se o token é válido e se é ADMIN
      const { payload } = await jwtVerify(token, SECRET);
      
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Se tentar acessar o carrinho sem estar logado, vai para o login
  if (request.nextUrl.pathname === '/client/carrinho') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verifica se o token é válido
      await jwtVerify(token, SECRET);
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configura quais rotas o middleware deve vigiar
export const config = {
  matcher: ['/admin/:path*', '/client/carrinho'],
};