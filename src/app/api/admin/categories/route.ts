import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { isAdminLoggedIn } from "@/lib/admin";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

function isDuplicateError(error: unknown) {
  return error && typeof error === "object" && (("code" in error && error.code === "ER_DUP_ENTRY") || ("errno" in error && error.errno === 1062));
}

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const productCategories = await db.select({ category: products.category }).from(products).groupBy(products.category);

  await Promise.all(
    productCategories
      .map((item) => item.category.trim())
      .filter(Boolean)
        .map(async (name) => {
          const now = new Date();
          return db.insert(categories)
            .values({ id: randomUUID(), name, createdAt: now, updatedAt: now })
            .onDuplicateKeyUpdate({ set: { name } });
        }),
  );

      const result = await db.select().from(categories).orderBy(asc(categories.name));
      return NextResponse.json({ categories: result });
}

export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ message: "Nama kategori wajib diisi." }, { status: 400 });
  }

  try {
    const now = new Date();
    await db.insert(categories).values({ id: randomUUID(), name, createdAt: now, updatedAt: now });
  } catch (error: unknown) {
    if (isDuplicateError(error)) return NextResponse.json({ message: "Kategori sudah tersedia." }, { status: 409 });
    throw error;
  }
  const [category] = await db.select().from(categories).where(eq(categories.name, name)).limit(1);

  return NextResponse.json({ category, message: "Kategori berhasil ditambahkan." }, { status: 201 });
}
