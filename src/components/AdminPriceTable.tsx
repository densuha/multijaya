"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/types/product";

export function AdminPriceTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function remove(id: string) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    setDeletingId(id);
    setMessage("");
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      setMessage("Gagal menghapus produk.");
      return;
    }

    setMessage("Produk berhasil dihapus.");
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      {message ? <p className="border-b border-slate-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Produk</th>
              <th className="px-4 py-3 text-left font-semibold">Foto</th>
              <th className="px-4 py-3 text-left font-semibold">Kategori</th>
              <th className="px-4 py-3 text-left font-semibold">Harga</th>
              <th className="px-4 py-3 text-left font-semibold">Stok</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-200 bg-white align-middle last:border-b-0">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="mt-1 max-w-40 truncate text-xs text-slate-400">{product.slug}</p>
                </td>
                <td className="px-4 py-4">
                  <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200" />
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{product.category}</span>
                  <p className="mt-2 text-xs text-slate-400">{product.unit}</p>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">{formatRupiah(product.price)}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{product.stock}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/produk/${product.id}/edit`}
                      className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      disabled={deletingId === product.id}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === product.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
