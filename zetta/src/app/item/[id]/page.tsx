import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import styles from "./item.module.css";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import AddToCartButton from "../../../components/AddToCartButton"; // Importe o botão

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) notFound();

  const sugestoes = await prisma.product.findMany({
    where: { NOT: { id: id } },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <FiArrowLeft size={20} /> Voltar para a loja
      </Link>

      <section className={styles.productWrapper}>
        <div className={styles.imageSection}>
          <img src={product.image} alt={product.name} className={styles.mainImage} />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>
          
          {/* Lógica de Estoque Visual */}
          <p className={styles.stock}>
            {product.stock > 0 ? (
              <>Disponível: <span>{product.stock} unidades</span></>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>PRODUTO ESGOTADO</span>
            )}
          </p>

          <div className={styles.descriptionBox}>
            <h3>Descrição do Produto</h3>
            <p>{product.description || "Sem descrição disponível."}</p>
          </div>

          <div className={styles.priceTag}>
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>

          {/* Botão Condicional: Só aparece se houver estoque e isAvailable for true */}
          {product.isAvailable && product.stock > 0 ? (
            <AddToCartButton productId={product.id} />
          ) : (
            <button className={styles.buyButton} disabled style={{ background: '#475569', cursor: 'not-allowed' }}>
              Indisponível
            </button>
          )}
        </div>
      </section>

      {/* Seção de Sugestões... (mantém igual) */}
      {sugestoes.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Quem viu este produto também se interessou</h2>
          <div className={styles.relatedGrid}>
            {sugestoes.map((item) => (
              <Link href={`/item/${item.id}`} key={item.id} className={styles.relatedCard}>
                <img src={item.image} alt={item.name} />
                <div className={styles.relatedInfo}>
                  <h4>{item.name}</h4>
                  <p>R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}