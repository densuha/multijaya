import { and, asc, eq, like, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import type { Product, ProductQuery } from "@/types/product";

type ProductRow = typeof products.$inferSelect;

function mapProduct(item: ProductRow): Product {
  return { ...item, features: Array.isArray(item.features) ? item.features : [] };
}

export async function getCategories() {
  const [groups, managedCategories] = await Promise.all([
    db.select({ category: products.category }).from(products).groupBy(products.category).orderBy(asc(products.category)),
    db.select().from(categories).orderBy(asc(categories.name)),
  ]);
  const names = new Set([...groups.map((item) => item.category), ...managedCategories.map((item) => item.name)]);
  return ["Semua", ...Array.from(names).sort()];
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const keyword = query.q?.trim();
  const category = query.category?.trim();
  const filters = [];
  if (category && category !== "Semua") filters.push(eq(products.category, category));
  if (keyword) filters.push(or(like(products.name, `%${keyword}%`), like(products.id, `%${keyword}%`), like(products.category, `%${keyword}%`))!);
  const items = await db.select().from(products).where(and(...filters)).orderBy(asc(products.name));
  return items.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const [item] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return item ? mapProduct(item) : null;
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const [current] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!current) return [];
  const items = await db.select().from(products).where(and(ne(products.slug, slug), eq(products.category, current.category)))
    .limit(limit).orderBy(asc(products.name));
  return items.map(mapProduct);
}