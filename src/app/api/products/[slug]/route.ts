import { NextResponse } from "next/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    product,
    related: await getRelatedProducts(slug),
  });
}
