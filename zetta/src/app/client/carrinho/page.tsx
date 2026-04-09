"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./carrinho.module.css";
import { FiTrash2, FiArrowLeft, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();

  // 1. Busca os itens salvos na tabela CartItem do Banco de Dados
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Erro ao buscar carrinho");
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Lógica para REMOVER item do banco
  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartItemId }),
      });

      if (res.ok) {
        // Atualiza a lista local removendo o item deletado
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      alert("Erro ao remover produto do carrinho.");
    }
  };

  // 3. Lógica para FINALIZAR COMPRA (Checkout)
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsFinishing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      if (res.ok) {
        alert("ZETTA: Compra simulada com sucesso! O estoque foi atualizado no banco.");
        router.push("/"); // Volta para a home
        router.refresh(); // Atualiza os dados da home (estoque/disponibilidade)
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error || "Falha no processamento"}`);
      }
    } catch (error) {
      alert("Erro crítico ao finalizar pedido.");
    } finally {
      setIsFinishing(false);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <div className={styles.container}><p>Carregando ZETTA Cart...</p></div>;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <FiArrowLeft /> Continuar Comprando
      </Link>

      <h1 className={styles.title}>Seu Carrinho</h1>

      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <p>Seu carrinho está vazio.</p>
          <Link href="/" className={styles.shopBtn}>Voltar à Loja</Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.list}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img src={item.product.image} alt={item.product.name} />
                <div className={styles.info}>
                  <h3>{item.product.name}</h3>
                  <p>Preço unitário: R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p>Quantidade: <strong>{item.quantity}</strong></p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className={styles.removeBtn}
                  title="Remover do carrinho"
                >
                  <FiTrash2 size={22} />
                </button>
              </div>
            ))}
          </div>

          <aside className={styles.summary}>
            <h2>Resumo da Compra</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Frete:</span>
              <span className={styles.free}>Grátis</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isFinishing} 
              className={styles.checkoutBtn}
            >
              {isFinishing ? (
                <> <FiLoader className={styles.spin} /> Processando... </>
              ) : (
                <> <FiCheckCircle /> Finalizar Pedido </>
              )}
            </button>
            <p className={styles.infoText}>
              * Esta é uma simulação. O estoque será reduzido no banco de dados ZETTA.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}