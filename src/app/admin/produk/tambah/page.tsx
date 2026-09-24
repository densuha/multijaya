import Link from "next/link";
import { CreateProductForm } from "@/components/CreateProductForm";
import { isAdminLoggedIn } from "@/lib/admin";
import { getCategories } from "@/lib/products";
import { redirect } from "next/navigation";

export const metadata = { title: "Tambah produk" };

export default async function AddProductPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const categories = await getCategories();

  return (
    <main className="w-full pb-12">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah produk</h1>
          <p className="mt-2 text-sm text-slate-500">Masukkan data produk baru ke database.</p>
        </div>
        <Link href="/admin/produk" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
          Kembali
        </Link>
      </div>
      <CreateProductForm categories={categories} />
    </main>
  );
}
