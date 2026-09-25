import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getCurrentAdmin, hashPassword, isAdminLoggedIn } from "@/lib/admin";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

function isDuplicateError(error: unknown) {
  return error && typeof error === "object" && (("code" in error && error.code === "ER_DUP_ENTRY") || ("errno" in error && error.errno === 1062));
}

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "admin") {
    return NextResponse.json({ message: "Hanya admin yang dapat mengelola pengguna." }, { status: 403 });
  }

  const users = await db.select({ id: adminUsers.id, username: adminUsers.username, role: adminUsers.role, createdAt: adminUsers.createdAt })
    .from(adminUsers).orderBy(asc(adminUsers.username));
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "admin" || !(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Hanya admin yang dapat menambah pengguna." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
    role?: string;
  };
  const username = body.username?.trim();
  const password = body.password ?? "";
  const role = body.role === "editor" ? "editor" : "admin";

  if (!username || password.length < 6) {
    return NextResponse.json({ message: "Username wajib diisi dan password minimal 6 karakter." }, { status: 400 });
  }

  try {
    const id = randomUUID();
    const now = new Date();
    await db.insert(adminUsers).values({ id, username, passwordHash: hashPassword(password), role, createdAt: now, updatedAt: now });
    const [user] = await db.select({ id: adminUsers.id, username: adminUsers.username, role: adminUsers.role, createdAt: adminUsers.createdAt })
      .from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return NextResponse.json({ user, message: "Pengguna berhasil ditambahkan." }, { status: 201 });
  } catch (error: unknown) {
    if (isDuplicateError(error)) {
      return NextResponse.json({ message: "Username sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal menambahkan pengguna." }, { status: 500 });
  }
}
