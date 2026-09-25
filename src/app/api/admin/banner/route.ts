import { chmodSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const bannerEyebrow = String(formData.get("bannerEyebrow") ?? "").trim();
    const bannerTitle = String(formData.get("bannerTitle") ?? "").trim();
    const bannerDescription = String(formData.get("bannerDescription") ?? "").trim();
    const uploadedFile = formData.get("bannerImage");
    const uploadedLogo = formData.get("logoImage");
    const currentSettings = await getSiteSettings();
    let bannerImage = currentSettings.bannerImage;
    let logoImage = currentSettings.logoImage;

    if (uploadedFile instanceof File && uploadedFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "banner");
      mkdirSync(uploadDir, { recursive: true });
      chmodSync(uploadDir, 0o775);

      const extension = path.extname(uploadedFile.name || ".jpg") || ".jpg";
      const filename = `banner-${Date.now()}-${randomBytes(4).toString("hex")}${extension}`;
      const targetPath = path.join(uploadDir, filename);
      writeFileSync(targetPath, Buffer.from(await uploadedFile.arrayBuffer()));
      chmodSync(targetPath, 0o775);
      bannerImage = `/uploads/banner/${filename}`;
    }

    if (uploadedLogo instanceof File && uploadedLogo.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "logo");
      mkdirSync(uploadDir, { recursive: true });
      chmodSync(uploadDir, 0o775);

      const extension = path.extname(uploadedLogo.name || ".png") || ".png";
      const filename = `logo-${Date.now()}-${randomBytes(4).toString("hex")}${extension}`;
      const targetPath = path.join(uploadDir, filename);
      writeFileSync(targetPath, Buffer.from(await uploadedLogo.arrayBuffer()));
      chmodSync(targetPath, 0o775);
      logoImage = `/uploads/logo/${filename}`;
    }

    const settings = await saveSiteSettings({ bannerEyebrow, bannerTitle, bannerDescription, bannerImage, logoImage });

    if (bannerImage !== currentSettings.bannerImage && currentSettings.bannerImage.startsWith("/uploads/banner/")) {
      const oldPath = path.join(process.cwd(), "public", currentSettings.bannerImage);
      try {
        unlinkSync(oldPath);
      } catch {
        // The old banner may already have been removed.
      }
    }

    if (logoImage !== currentSettings.logoImage && currentSettings.logoImage.startsWith("/uploads/logo/")) {
      const oldPath = path.join(process.cwd(), "public", currentSettings.logoImage);
      try {
        unlinkSync(oldPath);
      } catch {
        // The old logo may already have been removed.
      }
    }

    return NextResponse.json({ settings, message: "Banner berhasil disimpan." });
  } catch {
    return NextResponse.json({ message: "Gagal menyimpan banner." }, { status: 500 });
  }
}
