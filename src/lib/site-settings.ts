import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

const defaultSettings = {
  whatsappNumber: "6281234567890",
  storeName: "Multijaya",
  storeDescription: "Katalog produk dan harga terbaru.",
  footerText: "Harga dapat berubah sewaktu-waktu.",
};

export async function getSiteSettings() {
  const entries = await db.select().from(siteSettings);
  const map = Object.fromEntries(entries.map((item) => [item.key, item.value]));
  return {
    whatsappNumber: map.whatsappNumber ?? defaultSettings.whatsappNumber,
    storeName: map.storeName ?? defaultSettings.storeName,
    storeDescription: map.storeDescription ?? defaultSettings.storeDescription,
    footerText: map.footerText ?? defaultSettings.footerText,
  };
}

export async function saveSiteSettings(values: Partial<typeof defaultSettings>) {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string" || !value.trim()) continue;
    await db.insert(siteSettings).values({
      id: `setting-${Date.now()}-${randomBytes(4).toString("hex")}`,
      key,
      value: value.trim(),
    }).onDuplicateKeyUpdate({ set: { value: value.trim(), updatedAt: new Date() } });
  }
  return getSiteSettings();
}