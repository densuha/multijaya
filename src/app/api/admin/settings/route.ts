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
    storeAddress: string;
    phoneNumber: string;
    email: string;
    location: string;
  }>;

  if (body.location?.trim() && !/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(body.location.trim())) {
    return NextResponse.json({ message: "Lokasi harus berupa koordinat latitude,longitude." }, { status: 400 });
  }

  const settings = await saveSiteSettings({
    whatsappNumber: body.whatsappNumber,
    storeName: body.storeName,
    storeDescription: body.storeDescription,
    footerText: body.footerText,
    storeAddress: body.storeAddress,
    phoneNumber: body.phoneNumber,
    email: body.email,
    location: body.location,
  });

  return NextResponse.json({ settings, message: "Pengaturan website berhasil disimpan." });
}
