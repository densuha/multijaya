import { NextResponse } from "next/server";
import { getCurrentAdmin, hashPassword, isAdminLoggedIn } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "admin") {
    return NextResponse.json({ message: "Hanya admin yang dapat mengelola pengguna." }, { status: 403 });
  }

  const users = await prisma.adminUser.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { username: "asc" },
  });
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
    const user = await prisma.adminUser.create({
      data: { username, passwordHash: hashPassword(password), role },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user, message: "Pengguna berhasil ditambahkan." }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Username sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal menambahkan pengguna." }, { status: 500 });
  }
}
