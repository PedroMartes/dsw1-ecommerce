import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../lib/auth";

// 1. BUSCAR ITENS (filtrado por usuário)
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request as any);
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("ERRO NO BANCO DE DADOS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. ADICIONAR OU INCREMENTAR ITEM
export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request as any);
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
    }

    // Verifica se o produto existe e tem estoque
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock <= 0) {
      return NextResponse.json({ error: "Produto indisponível" }, { status: 400 });
    }

    // Verifica se este produto JÁ ESTÁ no carrinho do usuário
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { productId, userId: user.id }
    });

    if (existingCartItem) {
      // Se já existe, apenas aumenta a quantidade
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      return NextResponse.json(updatedItem);
    }

    // Se não existe, cria um novo registro no carrinho
    const newItem = await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        userId: user.id,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar ao carrinho" }, { status: 500 });
  }
}

// 3. REMOVER ITEM (filtrado por usuário)
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromToken(request as any);
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 });
    }

    // Verifica se o item pertence ao usuário
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id }
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item não encontrado ou não pertence ao usuário" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover item" }, { status: 500 });
  }
}

// 4. ATUALIZAR QUANTIDADE (filtrado por usuário)
export async function PATCH(request: Request) {
  try {
    const user = await getUserFromToken(request as any);
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const { id, quantity } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 });
    }

    // Verifica se o item pertence ao usuário
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id }
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item não encontrado ou não pertence ao usuário" }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ message: "Removido por quantidade zero" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar quantidade" }, { status: 500 });
  }
}