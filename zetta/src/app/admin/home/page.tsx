"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./home.module.css";

//icones
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

export default function AdminHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. BUSCAR PRODUTOS (READ)
  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 2. EXCLUIR PRODUTO (DELETE)
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Atualiza a lista local removendo o produto deletado
        setProducts(products.filter((p) => p.id !== id));
        alert("Produto removido com sucesso!");
      } else {
        alert("Erro ao remover produto.");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  if (loading) return <div className={styles.container}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-2xl font-bold">Gerenciamento de Estoque</h1>
        <Link href="/admin/produtos/novo" className={styles.addButton}>
          + Novo Produto
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.tableAdminHome}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-10">Nenhum produto encontrado.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                  </td>

                  <td className="font-medium">{product.name}</td>

                  <td>R$ {product.price.toFixed(2)}</td>

                  <td>{product.stock} un.</td>

                  <td className={styles.adminActions}>
                    {/* Botão Editar: Você pode levar para uma página de edição ou abrir um modal */}
                    <Link href={`/admin/produtos/editar/${product.id}`} className={styles.editBtnAdmin}>
                      <p className={styles.editButtonTextAdmin}>
                        Editar <FaPencilAlt size={14} />
                      </p>
                    </Link>

                    {/* Botão Excluir chamando a função DELETE da API */}
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteBtnAdmin}
                    >
                      Excluir <FaTrashCan size={14} />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}