import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "produk";
}

export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim() || "Umum";
    const unit = String(formData.get("unit") ?? "").trim() || "pcs";
    const rawSlug = String(formData.get("slug") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);
    const stock = Number(formData.get("stock") ?? 0);
    const description = String(formData.get("description") ?? "").trim();
    const rawFeatures = String(formData.get("features") ?? "").trim();
    const features = rawFeatures
      ? rawFeatures
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : ["Produk baru"];

    if (!name) {
      return NextResponse.json({ message: "Nama produk wajib diisi." }, { status: 400 });
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ message: "Harga produk tidak valid." }, { status: 400 });
    }

    const baseSlug = slugify(rawSlug || name);
    let slug = baseSlug;
    let index = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${index}`;
      index += 1;
    }

    let imageUrl = "/images/placeholder-product.svg";
    const uploadedFile = formData.get("image");

    if (uploadedFile instanceof File && uploadedFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      mkdirSync(uploadDir, { recursive: true });

      const extension = path.extname(uploadedFile.name || ".jpg") || ".jpg";
      const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;
      const targetPath = path.join(uploadDir, filename);

      writeFileSync(targetPath, Buffer.from(await uploadedFile.arrayBuffer()));
      imageUrl = `/uploads/products/${filename}`;
    }

    const product = await prisma.product.create({
      data: {
        id: `prod-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        slug,
        name,
        category,
        price: Math.round(price),
        stock: Math.max(0, Math.round(stock)),
        unit,
        rating: 0,
        description: description || `Produk ${name} dari Multijaya.`,
        image: imageUrl,
        features,
      },
    });

    return NextResponse.json({ product, message: "Produk berhasil ditambahkan." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan produk.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
