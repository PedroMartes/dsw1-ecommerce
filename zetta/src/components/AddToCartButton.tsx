"use client";

import { useState } from "react";
import { FiShoppingCart, FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";
import styles from "../app/item/[id]/item.module.css"; 

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    setLoading(true);
    try {
      // Primeiro, verifica se o usuário está logado fazendo uma requisição GET para /api/cart
      const checkAuthResponse = await fetch("/api/cart", {
        method: "GET",
        credentials: "include", // Inclui cookies na requisição
      });

      if (checkAuthResponse.status === 401) {
        // Usuário não autenticado, redireciona para login
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        router.push("/login");
        return;
      }

      // Se chegou aqui, usuário está logado, prossegue com adicionar ao carrinho
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
        credentials: "include",
      });

      if (response.ok) {
        alert("Produto adicionado ao carrinho!");
        router.push("/client/carrinho"); // Direciona o usuário para o carrinho
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error || "Erro ao adicionar produto."}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAdd} 
      className={styles.buyButton} 
      disabled={loading}
    >
      {loading ? (
        <FiLoader className="animate-spin" size={24} />
      ) : (
        <>
          <FiShoppingCart size={24} /> Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}