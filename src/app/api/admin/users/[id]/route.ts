import { NextResponse } from "next/server";
import { getCurrentAdmin, hashPassword } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const current = await getCurrentAdmin();
  return current?.role === "admin" ? current : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const current = await requireAdmin();
  if (!current) return NextResponse.json({ message: "Hanya admin yang dapat mengubah pengguna." }, { status: 403 });

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
    role?: string;
  };
  const username = body.username?.trim();
  const role = body.role === "editor" ? "editor" : "admin";

  if (!username) return NextResponse.json({ message: "Username wajib diisi." }, { status: 400 });
  if (body.password !== undefined && body.password.length < 6) {
    return NextResponse.json({ message: "Password minimal 6 karakter." }, { status: 400 });
  }

  try {
    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        username,
        role,
        ...(body.password ? { passwordHash: hashPassword(body.password) } : {}),
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user, message: "Pengguna berhasil diperbarui." });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Username sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const current = await requireAdmin();
  if (!current) return NextResponse.json({ message: "Hanya admin yang dapat menghapus pengguna." }, { status: 403 });

  const { id } = await params;
  if (id === current.id) {
    return NextResponse.json({ message: "Akun yang sedang digunakan tidak dapat dihapus." }, { status: 400 });
  }

  try {
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ message: "Pengguna berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }
}
