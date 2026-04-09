"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../login/login.module.css"; // Reaproveitando o CSS do login

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Conta criada com sucesso! Agora faça seu login.");
        router.push("/login");
      } else {
        setError(data.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Criar Conta ZETTA</h1>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className={styles.inputGroup}>
          <label>Nome</label>
          <input
            type="text"
            required
            className={styles.input}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>E-mail</label>
          <input
            type="email"
            required
            className={styles.input}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input
            type="password"
            required
            className={styles.input}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Cadastrando..." : "Criar Minha Conta"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Já tem uma conta? <Link href="/login" className="text-blue-500 hover:underline">Entre aqui</Link>
        </p>
      </form>
    </div>
  );
}