import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const productCategories = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  await Promise.all(
    productCategories
      .map((item) => item.category.trim())
      .filter(Boolean)
      .map((name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } })),
  );

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
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

  const category = await prisma.category.create({ data: { name } }).catch((error: unknown) => {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return null;
    }
    throw error;
  });

  if (!category) {
    return NextResponse.json({ message: "Kategori sudah tersedia." }, { status: 409 });
  }

  return NextResponse.json({ category, message: "Kategori berhasil ditambahkan." }, { status: 201 });
}
