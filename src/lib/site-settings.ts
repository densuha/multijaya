import { prisma } from "@/lib/prisma";

const defaultSettings = {
  whatsappNumber: "6281234567890",
  storeName: "Multijaya",
  storeDescription: "Katalog produk dan harga terbaru.",
  footerText: "Harga dapat berubah sewaktu-waktu.",
};

export async function getSiteSettings() {
  const entries = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(entries.map((item) => [item.key, item.value]));

  return {
    whatsappNumber: map.whatsappNumber ?? defaultSettings.whatsappNumber,
    storeName: map.storeName ?? defaultSettings.storeName,
    storeDescription: map.storeDescription ?? defaultSettings.storeDescription,
    footerText: map.footerText ?? defaultSettings.footerText,
  };
}

export async function saveSiteSettings(values: Partial<typeof defaultSettings>) {
  const entries = Object.entries(values);

  for (const [key, value] of entries) {
    if (typeof value !== "string" || !value.trim()) continue;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value.trim() },
      create: { key, value: value.trim() },
    });
  }

  return getSiteSettings();
}
