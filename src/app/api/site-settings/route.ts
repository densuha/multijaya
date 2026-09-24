import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  return NextResponse.json({ settings: await getSiteSettings() });
}
