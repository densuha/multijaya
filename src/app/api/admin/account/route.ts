import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCurrentAdmin, hashPassword, isAdminLoggedIn, setAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

function isDuplicateError(error: unknown) {
  return error && typeof error === "object" && (("code" in error && error.code === "ER_DUP_ENTRY") || ("errno" in error && error.errno === 1062));
}

export async function GET() {
  const account = await getCurrentAdmin();
  if (!account) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ account });
}

export async function PATCH(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
    role?: string;
  };
  const username = body.username?.trim();
  const role = body.role === "editor" ? "editor" : "admin";

  if (!username) return NextResponse.json({ message: "Username wajib diisi." }, { status: 400 });
  if (body.password && current.role !== "admin") {
    return NextResponse.json({ message: "Hanya role Admin yang dapat reset password." }, { status: 403 });
  }
  if (body.password !== undefined && body.password.length < 6) {
    return NextResponse.json({ message: "Password minimal 6 karakter." }, { status: 400 });
  }

  try {
    await db.update(adminUsers).set({ username, role, ...(body.password ? { passwordHash: hashPassword(body.password) } : {}), updatedAt: new Date() }).where(eq(adminUsers.id, current.id));
    const [account] = await db.select({ id: adminUsers.id, username: adminUsers.username, role: adminUsers.role })
      .from(adminUsers).where(eq(adminUsers.id, current.id)).limit(1);
    await setAdminSession(account.username);
    return NextResponse.json({ account, message: "Pengaturan akun berhasil disimpan." });
  } catch (error: unknown) {
    if (isDuplicateError(error)) {
      return NextResponse.json({ message: "Username sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal menyimpan pengaturan akun." }, { status: 500 });
  }
}
