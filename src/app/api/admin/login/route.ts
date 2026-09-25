import { NextResponse } from "next/server";
import { authenticateAdmin, setAdminSession } from "@/lib/admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const account = await authenticateAdmin(body.username ?? "", body.password ?? "");
    if (!account) {
      return NextResponse.json({ message: "Username atau password salah" }, { status: 401 });
    }
    await setAdminSession(account.username);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ message: "Login gagal karena konfigurasi server atau database." }, { status: 500 });
  }
}
