import { products as seedProducts } from "../src/data/products";
import { db, pool } from "../src/lib/db";
import { products } from "../src/lib/db/schema";

async function main() {
  for (const product of seedProducts) {
    await db.insert(products).values({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      rating: product.rating,
      description: product.description,
      image: product.image,
      features: product.features,
    }).onDuplicateKeyUpdate({
      set: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        rating: product.rating,
        description: product.description,
        image: product.image,
        features: product.features,
        updatedAt: new Date(),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());