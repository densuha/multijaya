import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCurrentAdmin, hashPassword } from "@/lib/admin";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

function isDuplicateError(error: unknown) {
  return error && typeof error === "object" && (("code" in error && error.code === "ER_DUP_ENTRY") || ("errno" in error && error.errno === 1062));
}

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
    const result = await db.update(adminUsers).set({ username, role, ...(body.password ? { passwordHash: hashPassword(body.password) } : {}), updatedAt: new Date() }).where(eq(adminUsers.id, id));
    if (!result[0].affectedRows) return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
    const [user] = await db.select({ id: adminUsers.id, username: adminUsers.username, role: adminUsers.role, createdAt: adminUsers.createdAt })
      .from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return NextResponse.json({ user, message: "Pengguna berhasil diperbarui." });
  } catch (error: unknown) {
    if (isDuplicateError(error)) {
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
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
    if (!result[0].affectedRows) return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ message: "Pengguna berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }
}
