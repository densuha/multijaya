import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { isAdminLoggedIn } from "@/lib/admin";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

function isDuplicateError(error: unknown) {
  return error && typeof error === "object" && (("code" in error && error.code === "ER_DUP_ENTRY") || ("errno" in error && error.errno === 1062));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ message: "Nama kategori wajib diisi." }, { status: 400 });
  }

  try {
    const result = await db.update(categories).set({ name, updatedAt: new Date() }).where(eq(categories.id, id));
    if (!result[0].affectedRows) return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
    const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return NextResponse.json({ category, message: "Kategori berhasil diperbarui." });
  } catch (error: unknown) {
    if (isDuplicateError(error)) {
      return NextResponse.json({ message: "Kategori sudah tersedia." }, { status: 409 });
    }
    return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await db.delete(categories).where(eq(categories.id, id));
    if (!result[0].affectedRows) return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ message: "Kategori berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
  }
}
