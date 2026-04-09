import { prisma } from "../lib/prisma";
import styles from "./home.module.css";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Explore Nossos Eletrônicos</h1>

      <div className={styles.grid}>
        {products.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            Nenhum produto disponível no momento.
          </p>
        ) : (
          products.map((product) => (
            /* Ajustado para a nova rota de cliente */
            <Link 
              href={`/item/${product.id}`} 
              key={product.id} 
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={styles.image} 
                  />
                </div>
                
                <div className={styles.content}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  
                  <div className="mt-auto">
                    <p className={styles.stock}>Estoque: {product.stock} un.</p>
                    <p className={styles.price}>
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}