import Link from "next/link";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              PT Multijaya
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Katalog produk lengkap dengan harga transparan.
            </h1>
            <p className="mt-4 max-w-xl text-slate-200">
              Data produk dan harga diambil dari MySQL Laragon. Admin dapat mengubah
              stok, harga, dan foto produk langsung dari panel kontrol.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produk"
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
              >
                Lihat semua produk
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Jenis produk", value: `${products.length}+` },
              { label: "Kategori", value: `${categories.length - 1}` },
              { label: "Update harga", value: "Admin" },
              { label: "Sumber data", value: "MySQL" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <p className="text-2xl font-bold text-amber-300">{item.value}</p>
                <p className="mt-1 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductCatalog initialProducts={products} initialCategories={categories} />
    </main>
  );
}
