import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request as any);
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    // 1. Inicia uma Transação no Prisma (ou faz tudo, ou não faz nada)
    const resultado = await prisma.$transaction(async (tx) => {

      // 2. Busca os itens que estão no carrinho do usuário
      const cartItems = await tx.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true }
      });

      if (cartItems.length === 0) {
        throw new Error("Carrinho vazio");
      }

      // 3. Calcula o total do pedido
      const totalPedido = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );

      // 4. Cria o Pedido (Tabela Order)
      const novoPedido = await tx.order.create({
        data: {
          total: totalPedido,
          status: "Finalizado",
          // Cria os itens do pedido (OrderItem) simultaneamente
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // 5. Atualiza o Estoque e a Disponibilidade de cada produto
      for (const item of cartItems) {
        const novoEstoque = item.product.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: novoEstoque < 0 ? 0 : novoEstoque,
            // Se o novo estoque for 0 ou menos, isAvailable vira false
            isAvailable: novoEstoque > 0,
          },
        });
      }

      // 6. Limpa o carrinho do usuário após a compra
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      });

      return novoPedido;
    });

    return NextResponse.json({ message: "Sucesso", order: resultado });

  } catch (error: any) {
    console.error("Erro no checkout:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar compra" },
      { status: 500 }
    );
  }
}