"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./novoProduto.module.css";

export default function NovoProduto() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"), // <-- Capturando a nova descrição
      price: formData.get("price"),
      stock: formData.get("stock"),
      image: imagePreview,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        router.push("/admin/home");
        router.refresh();
      } else {
        alert("Erro ao cadastrar produto.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-6 text-blue-500">Novo Produto</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.group}>
          <label>Nome do Eletrônico</label>
          <input 
            name="name" 
            type="text" 
            required 
            className={styles.input} 
            placeholder="Ex: Teclado Mecânico RGB" 
          />
        </div>

        {/* --- NOVO CAMPO DE DESCRIÇÃO --- */}
        <div className={styles.group}>
          <label>Descrição do Produto</label>
          <textarea 
            name="description" 
            required 
            className={styles.input} 
            rows={4} 
            placeholder="Detalhes técnicos, diferenciais, especificações..."
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Preço (R$)</label>
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              required 
              className={styles.input} 
              placeholder="0.00" 
            />
          </div>
          <div className={styles.group}>
            <label>Estoque</label>
            <input 
              name="stock" 
              type="number" 
              required 
              className={styles.input} 
              placeholder="0" 
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Imagem do Produto</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            required 
            className={styles.input} 
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className={styles.preview} />
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Salvando..." : "Cadastrar Produto"}
        </button>
      </form>
    </div>
  );
}