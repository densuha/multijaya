"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types/product";

type FormState = {
  name: string;
  category: string;
  slug: string;
  unit: string;
  price: string;
  stock: string;
  description: string;
  features: string;
};

function toFormState(product: Product): FormState {
  const unitAmount = product.unit.match(/\d+(?:\.\d+)?/)?.[0] ?? "1";

  return {
    name: product.name,
    category: product.category,
    slug: product.slug,
    unit: unitAmount,
    price: String(product.price),
    stock: String(product.stock),
    description: product.description,
    features: product.features.join(", "),
  };
}

export function EditProductForm({ product, categories }: { product: Product; categories: string[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([field, value]) => formData.append(field, value));
      if (image) formData.append("image", image);

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setMessage(data.message ?? "Gagal menyimpan perubahan.");
        return;
      }

      setMessage("Perubahan produk berhasil disimpan.");
      router.push("/admin/produk");
      router.refresh();
    } catch {
      setMessage("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.04)] sm:p-5">
      {message ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {([
          ["name", "Nama produk"],
          ["category", "Kategori"],
          ["slug", "Slug"],
          ["unit", "Satuan"],
          ["price", "Harga"],
          ["stock", "Stok"],
        ] as const).map(([field, label]) => (
          <label key={field} className="space-y-2 text-sm font-medium text-slate-700">
            <span>{label}</span>
            {field === "category" ? (
              <select
                required
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                {categories.filter((category) => category !== "Semua").map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            ) : field === "unit" ? (
              <div className="flex items-center gap-2">
                <input
                  required
                  type="number"
                  min={1}
                  value={form.unit}
                  onChange={(event) => updateField("unit", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
                <span className="inline-flex min-w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-600">
                  pcs
                </span>
              </div>
            ) : (
              <input
                required={field === "name" || field === "price" || field === "stock"}
                type={field === "price" || field === "stock" ? "number" : "text"}
                min={field === "price" || field === "stock" ? 0 : undefined}
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            )}
          </label>
        ))}

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Ganti foto produk</span>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 transition hover:border-slate-400 hover:bg-slate-100">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>
        </label>
      </div>

      <label className="mt-3 block space-y-2 text-sm font-medium text-slate-700">
        <span>Deskripsi</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <label className="mt-3 block space-y-2 text-sm font-medium text-slate-700">
        <span>Fitur (pisahkan dengan koma)</span>
        <input
          value={form.features}
          onChange={(event) => updateField("features", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Menyimpan..." : "Simpan perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produk")}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
