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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let imageUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image");

    if (file instanceof File && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      mkdirSync(uploadDir, { recursive: true });

      const ext = path.extname(file.name || ".jpg") || ".jpg";
      const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
      const targetPath = path.join(uploadDir, filename);

      writeFileSync(targetPath, Buffer.from(await file.arrayBuffer()));
      imageUrl = `/uploads/products/${filename}`;
    }

    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const unit = String(formData.get("unit") ?? "").trim();
    const price = Number(formData.get("price") ?? "");
    const stock = Number(formData.get("stock") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const features = String(formData.get("features") ?? "").trim();

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (slug) updateData.slug = slugify(slug || name || product.slug);
    if (unit) updateData.unit = unit;
    if (Number.isFinite(price)) updateData.price = Math.max(0, Math.round(price));
    if (Number.isFinite(stock)) updateData.stock = Math.max(0, Math.round(stock));
    if (description) updateData.description = description;
    if (features) {
      updateData.features = features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (imageUrl) updateData.image = imageUrl;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product: updated });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    category?: string;
    slug?: string;
    unit?: string;
    price?: number;
    stock?: number;
    description?: string;
    features?: string;
    image?: string;
  };

  const updateData: Record<string, string | number | null | string[]> = {};
  if (typeof body.name === "string" && body.name.trim()) updateData.name = body.name.trim();
  if (typeof body.category === "string" && body.category.trim()) updateData.category = body.category.trim();
  if (typeof body.slug === "string" && body.slug.trim()) updateData.slug = slugify(body.slug.trim());
  if (typeof body.unit === "string" && body.unit.trim()) updateData.unit = body.unit.trim();
  if (Number.isFinite(body.price)) updateData.price = Math.max(0, Math.round(body.price as number));
  if (Number.isFinite(body.stock)) updateData.stock = Math.max(0, Math.round(body.stock as number));
  if (typeof body.description === "string" && body.description.trim()) updateData.description = body.description.trim();
  if (typeof body.features === "string") {
    const normalized = body.features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (normalized.length) updateData.features = normalized;
  }
  if (typeof body.image === "string" && body.image.trim()) updateData.image = body.image.trim();
  if (imageUrl) updateData.image = imageUrl;

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Produk berhasil dihapus." });
}
