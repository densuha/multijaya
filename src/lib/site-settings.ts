import { randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

const defaultSettings = {
  whatsappNumber: "6281234567890",
  storeName: "Multijaya",
  storeDescription: "Katalog produk dan harga terbaru.",
  footerText: "Harga dapat berubah sewaktu-waktu.",
  storeAddress: "Alamat toko belum diatur.",
  phoneNumber: "",
  email: "",
  location: "",
  bannerEyebrow: "PT Multijaya",
  bannerTitle: "Katalog produk lengkap dengan harga transparan.",
  bannerDescription: "Data produk dan harga terbaru untuk kebutuhan bisnis Anda.",
  bannerImage: "",
  logoImage: "",
};

function normalizeLocation(value: string) {
  const coordinates = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+)/)
    ?? value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  return coordinates ? `${coordinates[1]},${coordinates[2]}` : value.trim();
}

export async function getSiteSettings() {
  const entries = await db.select().from(siteSettings);
  const map = Object.fromEntries(entries.map((item) => [item.key, item.value]));
  return {
    whatsappNumber: map.whatsappNumber ?? defaultSettings.whatsappNumber,
    storeName: map.storeName ?? defaultSettings.storeName,
    storeDescription: map.storeDescription ?? defaultSettings.storeDescription,
    footerText: map.footerText ?? defaultSettings.footerText,
    storeAddress: map.storeAddress ?? defaultSettings.storeAddress,
    phoneNumber: map.phoneNumber ?? defaultSettings.phoneNumber,
    email: map.email ?? defaultSettings.email,
    location: normalizeLocation(map.location ?? defaultSettings.location),
    bannerEyebrow: map.bannerEyebrow ?? defaultSettings.bannerEyebrow,
    bannerTitle: map.bannerTitle ?? defaultSettings.bannerTitle,
    bannerDescription: map.bannerDescription ?? defaultSettings.bannerDescription,
    bannerImage: map.bannerImage ?? defaultSettings.bannerImage,
    logoImage: map.logoImage ?? defaultSettings.logoImage,
  };
}

export async function saveSiteSettings(values: Partial<typeof defaultSettings>) {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string" || !value.trim()) continue;
    await db.insert(siteSettings).values({
      id: `setting-${Date.now()}-${randomBytes(4).toString("hex")}`,
      key,
      value: value.trim(),
      updatedAt: sql`CURRENT_TIMESTAMP(3)`,
    }).onDuplicateKeyUpdate({ set: { value: value.trim(), updatedAt: new Date() } });
  }
  return getSiteSettings();
}