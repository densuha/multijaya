import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ settings: await getSiteSettings() });
}

export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<{
    whatsappNumber: string;
    storeName: string;
    storeDescription: string;
    footerText: string;
  }>;

  const settings = await saveSiteSettings({
    whatsappNumber: body.whatsappNumber,
    storeName: body.storeName,
    storeDescription: body.storeDescription,
    footerText: body.footerText,
  });

  return NextResponse.json({ settings, message: "Pengaturan website berhasil disimpan." });
}
