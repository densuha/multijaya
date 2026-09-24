import type { Product as PrismaProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product, ProductQuery } from "@/types/product";

function mapProduct(item: PrismaProduct): Product {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.price,
    stock: item.stock,
    unit: item.unit,
    rating: item.rating,
    description: item.description,
    image: item.image,
    features: Array.isArray(item.features) ? (item.features as string[]) : [],
  };
}

export async function getCategories() {
  const [groups, managedCategories] = await Promise.all([
    prisma.product.groupBy({ by: ["category"], orderBy: { category: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  const names = new Set([
    ...groups.map((item) => item.category),
    ...managedCategories.map((item) => item.name),
  ]);
  return ["Semua", ...Array.from(names).sort()];
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const keyword = query.q?.trim();
  const category = query.category?.trim();
  const items = await prisma.product.findMany({
    where: {
      AND: [
        category && category !== "Semua" ? { category } : {},
        keyword
          ? {
              OR: [
                { name: { contains: keyword } },
                { id: { contains: keyword } },
                { category: { contains: keyword } },
              ],
            }
          : {},
      ],
    },
    orderBy: { name: "asc" },
  });
  return items.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const item = await prisma.product.findUnique({ where: { slug } });
  return item ? mapProduct(item) : null;
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const current = await prisma.product.findUnique({ where: { slug } });
  if (!current) return [];
  const items = await prisma.product.findMany({
    where: { slug: { not: slug }, category: current.category },
    take: limit,
    orderBy: { name: "asc" },
  });
  return items.map(mapProduct);
}
