"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./carousel.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const banners = [
  {
    id: 1,
    image: "/setup.png", // Caminho absoluto para imagem da pasta /public
    title: "Setup Gamer ZETTA",
    subtitle: "Desempenho Extremo",
  },
  {
    id: 2,
    image: "/fone.png", // Caminho absoluto para imagem da pasta /public
    title: "ZETTA Áudio Premium",
    subtitle: "Imersão Total",
  },
  {
    id: 3,
    image: "/mouseteclado.png", // Caminho absoluto para imagem da pasta /public
    title: "Linha Pró Periféricos",
    subtitle: "Precisão em Cada Clique",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});

  // Marca que o componente foi montado (resolve hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pré-carrega as imagens quando o componente monta
  useEffect(() => {
    banners.forEach((banner) => {
      const img = new Image();
      img.src = banner.image;
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [banner.id]: true }));
      };
      img.onerror = () => {
        console.warn(`Erro ao carregar imagem: ${banner.image}`);
      };
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, []);

  // Rotação Automática (Autoplay)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    return () => clearInterval(timer); // Limpa o timer ao sair da página
  }, [nextSlide]);

  // Renderiza vazio até o componente estar montado (evita hydration mismatch)
  if (!mounted) {
    return <div className={styles.container} style={{ background: "#1a1a1a" }} />;
  }

  return (
    <div className={styles.container}>
      {banners.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === current ? styles.active : ""}`}
          style={{ 
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {index === current && (
            <div className={styles.content}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.subtitle}>{slide.subtitle}</p>
            </div>
          )}
        </div>
      ))}

      {/* Botões de Navegação */}
      <button onClick={prevSlide} className={`${styles.navBtn} ${styles.left}`}>
        <FiChevronLeft size={30} />
      </button>
      <button onClick={nextSlide} className={`${styles.navBtn} ${styles.right}`}>
        <FiChevronRight size={30} />
      </button>

      {/* Indicadores (Pontinhos) */}
      <div className={styles.indicators}>
        {banners.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === current ? styles.dotActive : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}