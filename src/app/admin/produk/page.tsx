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
      <h1 className="text-2xl font-bold text-slate-900">Kelola harga & stok</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tambah produk baru, ubah harga, stok, foto, dan kategori yang tersimpan di database MySQL Laragon.
      </p>

      <div className="mt-8 flex justify-end">
        <Link
          href="/admin/produk/tambah"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Tambah produk
        </Link>
      </div>
      <div className="mt-4">
        <AdminPriceTable products={products} />
      </div>
    </main>
  );
}
