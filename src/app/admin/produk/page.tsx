import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPriceTable } from "@/components/AdminPriceTable";
import { isAdminLoggedIn } from "@/lib/admin";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin harga" };

export default async function AdminProductsPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const products = await getProducts();

  return (
    <main className="w-full pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Produk</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Kelola harga & stok</h1>
          </div>

          <Link
            href="/admin/produk/tambah"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            Tambah produk
          </Link>
        </div>

        <p className="mt-4 max-w-2xl text-sm text-slate-500">
          Tambah produk baru, ubah harga, stok, foto, dan kategori yang tersimpan di database MySQL Laragon.
        </p>
      </div>

      <div className="mt-6">
        <AdminPriceTable products={products} />
      </div>
    </main>
  );
}
