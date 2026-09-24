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
      <h1 className="text-2xl font-bold text-slate-900">Kategori</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tambah, ubah, dan hapus kategori produk.
      </p>
      <div className="mt-6"><CategoryManager products={products} /></div>
    </main>
  );
}
