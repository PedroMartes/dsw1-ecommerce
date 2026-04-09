"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./editar.module.css"; 

export default function EditarProduto() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "", // <-- Novo campo adicionado
    price: "",
    stock: "",
    image: ""
  });
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const item = data.find((p: any) => p.id === params.id);
        
        if (item) {
          setProduct({
            name: item.name,
            description: item.description || "", // <-- Preenchendo a descrição
            price: item.price.toString(),
            stock: item.stock.toString(),
            image: item.image
          });
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          name: product.name,
          description: product.description, // <-- Enviando para a API
          price: product.price,
          stock: product.stock,
          image: product.image,
        }),
      });

      if (response.ok) {
        alert("Produto atualizado com sucesso!");
        router.push("/admin/home");
        router.refresh();
      } else {
        alert("Erro ao atualizar produto.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Carregando dados...</div>;

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-6 text-blue-500">Editar Produto</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.group}>
          <label>Nome do Produto</label>
          <input 
            type="text" 
            required 
            className={styles.input}
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
          />
        </div>

        {/* --- NOVO CAMPO DE DESCRIÇÃO --- */}
        <div className={styles.group}>
          <label>Descrição Detalhada</label>
          <textarea 
            required 
            className={styles.input}
            rows={4}
            placeholder="Descreva as especificações do produto..."
            value={product.description}
            onChange={(e) => setProduct({...product, description: e.target.value})}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Preço (R$)</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              className={styles.input}
              value={product.price}
              onChange={(e) => setProduct({...product, price: e.target.value})}
            />
          </div>
          <div className={styles.group}>
            <label>Estoque</label>
            <input 
              type="number" 
              required 
              className={styles.input}
              value={product.stock}
              onChange={(e) => setProduct({...product, stock: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Imagem do Produto</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className={styles.input} />
          {product.image && (
            <img src={product.image} alt="Preview" className={styles.preview} />
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className={styles.button} style={{flex: 2}}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button 
            type="button" 
            onClick={() => router.back()} 
            className={styles.button} 
            style={{flex: 1, backgroundColor: "#475569"}}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}