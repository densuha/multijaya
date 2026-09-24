import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditProductForm } from "@/components/EditProductForm";
import { isAdminLoggedIn } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/products";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit produk" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");

  const { id } = await params;
  const item = await prisma.product.findUnique({ where: { id } });
  if (!item) notFound();
  const categories = await getCategories();

  const product: Product = {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.price,
    stock: item.stock,
    unit: item.unit,
    rating: item.rating,
    description: item.description,
    image: item.image,
    features: Array.isArray(item.features) ? (item.features as string[]) : [],
  };

  return (
    <main className="w-full pb-12">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit produk</h1>
          <p className="mt-2 text-sm text-slate-500">Perbarui data produk, harga, stok, dan foto.</p>
        </div>
        <Link href="/admin/produk" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
          Kembali
        </Link>
      </div>
      <EditProductForm product={product} categories={categories} />
    </main>
  );
}
