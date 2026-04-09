"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css"; // Importando o CSS Module

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("zetta-user", JSON.stringify(data.user));

            // Para fins de teste rápido, use o window.location para forçar o refresh total
            if (data.user.role === "ADMIN") {
                window.location.href = "/admin/home";
            } else {
                window.location.href = "/";
            }
        } else {
            setError(data.error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.formCard}>
                <h1 className={styles.title}>ZETTA LOGIN</h1>

                {error && <p className={styles.error}>{error}</p>}

                <input
                    type="email"
                    placeholder="E-mail"
                    className={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Senha"
                    className={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className={styles.button}>
                    Entrar
                </button>
            </form>
        </div>
    );
}