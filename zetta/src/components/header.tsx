"use client";

import Link from "next/link";
import styles from "./header.module.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Importe isso

export default function Header() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const pathname = usePathname(); // Toda vez que a URL mudar, o header vai rodar esse código

    useEffect(() => {
        const savedUser = localStorage.getItem("zetta-user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null);
        }
    }, [pathname]); // <-- O segredo está aqui: re-executa ao mudar de página

    const handleLogout = async () => {
        try {
            // 1. Avisa o servidor para limpar o Cookie
            await fetch("/api/auth/logout", { method: "POST" });

            // 2. Limpa o localStorage (que usamos para o nome do usuário no Header)
            localStorage.removeItem("zetta-user");

            // 3. Limpa o estado local para o Header atualizar visualmente na hora
            setUser(null);

            // 4. Manda o usuário para a Home
            window.location.href = "/";
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    // 1. GUEST (NÃO LOGADO)
    if (!user) {
        return (
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>ZETTA</Link>
                <div className={styles.navRegisterLogin}>
                    <Link href="/register" className={styles.registerBtn}>Criar Conta</Link>
                    <Link href="/login" className={styles.loginBtn}>Entrar</Link>
                </div>
            </header>
        );
    }

    // 2. ADMIN
    if (user.role === "ADMIN") {
        return (
            <header className={`${styles.header} ${styles.adminBg}`}>
                <Link href="/admin/home" className={styles.logo}>ZETTA <span className={styles.badge}>ADMIN</span></Link>
                <nav className={styles.navAdminButtons}>
                    <Link href="/" className={styles.firstPage}>Página Inicial</Link>
                    <Link href="/admin/home" className={styles.firstPage}>Controle</Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
                </nav>
            </header>
        );
    }

    // 3. CLIENTE
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>ZETTA</Link>
            <nav className={styles.navNameOut}>
                <span>Olá, {user.name}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
            </nav>
        </header>
    );
};

