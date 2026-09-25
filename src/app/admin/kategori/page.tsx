import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/CategoryManager";
import { isAdminLoggedIn } from "@/lib/admin";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Kategori" };

export default async function AdminCategoryPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const products = await getProducts();

  return (
    <main className="w-full pb-12">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Katalog produk</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Kategori</h1>
        <p className="mt-3 text-sm text-slate-500">
        Tambah, ubah, dan hapus kategori produk.
        </p>
      </div>
      <div className="mt-6"><CategoryManager products={products} /></div>
    </main>
  );
}
