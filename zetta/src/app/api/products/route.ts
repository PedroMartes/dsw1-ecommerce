import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// --- LER TODOS (READ) ---
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// --- CRIAR NOVO (CREATE) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Adicionado description na desestruturação
    const { name, description, image, price, stock } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description, // <-- Novo campo salvo aqui
        image,
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("ERRO POST:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

// --- ATUALIZAR (UPDATE) ---
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // Adicionado description na desestruturação
    const { id, name, description, image, price, stock } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description, // <-- Novo campo atualizado aqui
        image,
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("ERRO PUT:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

// --- DELETAR (DELETE) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Produto removido" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}