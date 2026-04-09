"use client";

import Link from "next/link";
import styles from "./header.module.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi"; // Importando o ícone

export default function Header() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const savedUser = localStorage.getItem("zetta-user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            localStorage.removeItem("zetta-user");
            setUser(null);
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
                    {/* Botão de Carrinho para Admin (Opcional) */}
                    <Link href="/client/carrinho" className={styles.cartIconLink}>
                        <FiShoppingCart size={22} />
                    </Link>
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
                {/* BOTÃO DO CARRINHO */}
                <Link href="/client/carrinho" className={styles.cartIconLink} title="Meu Carrinho">
                    <FiShoppingCart size={24} />
                </Link>
                
                <span className={styles.userName}>Olá, {user.name}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
            </nav>
        </header>
    );
};