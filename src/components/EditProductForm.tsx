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
  return {
    name: product.name,
    category: product.category,
    slug: product.slug,
    unit: product.unit,
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
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5">
      {message ? <p className="mb-4 text-sm text-emerald-700">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {([
          ["name", "Nama produk"],
          ["category", "Kategori"],
          ["slug", "Slug"],
          ["unit", "Satuan"],
          ["price", "Harga"],
          ["stock", "Stok"],
        ] as const).map(([field, label]) => (
          <label key={field} className="space-y-1 text-sm text-slate-600">
            <span>{label}</span>
            {field === "category" ? (
              <select
                required
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              >
                {categories.filter((category) => category !== "Semua").map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            ) : (
              <input
                required={field === "name" || field === "price" || field === "stock"}
                type={field === "price" || field === "stock" ? "number" : "text"}
                min={field === "price" || field === "stock" ? 0 : undefined}
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            )}
          </label>
        ))}

        <label className="space-y-1 text-sm text-slate-600">
          <span>Ganti foto produk</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-1 text-sm text-slate-600">
        <span>Deskripsi</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
        />
      </label>

      <label className="mt-4 block space-y-1 text-sm text-slate-600">
        <span>Fitur (pisahkan dengan koma)</span>
        <input
          value={form.features}
          onChange={(event) => updateField("features", event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
        />
      </label>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Menyimpan..." : "Simpan perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produk")}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
