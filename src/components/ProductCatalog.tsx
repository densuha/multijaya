"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type CatalogResponse = {
  products: Product[];
  categories: string[];
  total: number;
};

export function ProductCatalog({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const categories = initialCategories;

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      const response = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      });
      const data: CatalogResponse = await response.json();
      setProducts(data.products);
      setLoading(false);
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, category]);

  return (
    <section id="katalog" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
            Katalog dinamis
          </p>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Produk & Harga
          </h2>
          <p className="mt-2 text-slate-500">
            Cari, filter kategori, lalu lihat detail harga satuan.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          {loading ? "Memuat..." : `${products.length} produk ditampilkan`}
        </p>
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama, kode, atau kategori produk..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-400 focus:ring-2"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Tidak ada produk yang cocok. Coba kata kunci lain.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
