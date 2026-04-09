import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zetta Store",
  description: "Loja de Eletrônicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* O Header agora está no lugar certo: dentro do body */}
        <Header />
        
        {/* O 'flex-1' garante que o conteúdo ocupe o espaço restante, 
            empurrando um possível footer para o rodapé */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}