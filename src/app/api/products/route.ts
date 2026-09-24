import { NextRequest, NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const items = await getProducts({ q, category });

  return NextResponse.json({
    products: items,
    categories: await getCategories(),
    total: items.length,
  });
}
