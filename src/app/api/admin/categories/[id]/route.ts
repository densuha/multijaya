import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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
    const category = await prisma.category.update({ where: { id }, data: { name } });
    return NextResponse.json({ category, message: "Kategori berhasil diperbarui." });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Kategori berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
  }
}
