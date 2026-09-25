"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

const initialState: FormState = {
  name: "",
  category: "Umum",
  slug: "",
  unit: "pcs",
  price: "",
  stock: "0",
  description: "",
  features: "",
};

export function CreateProductForm({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
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
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("slug", form.slug);
      formData.append("unit", form.unit);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("features", form.features);
      if (image) formData.append("image", image);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({ message: "Gagal menambahkan produk." }))) as {
        message?: string;
      };

      if (!response.ok) {
        setMessage(data.message ?? "Gagal menambahkan produk.");
        setSaving(false);
        return;
      }

      setForm(initialState);
      setImage(null);
      router.push("/admin/produk");
    } catch {
      setMessage("Gagal menambahkan produk.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Tambah produk baru</h2>
          <p className="mt-1 text-xs text-slate-500">Data akan langsung masuk ke database MySQL Laragon.</p>
        </div>
      </div>

      {message ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Nama produk</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Kategori</span>
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
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Slug</span>
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="Opsional, auto dari nama"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Satuan</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={form.unit}
              onChange={(event) => updateField("unit", event.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
            />
            <span className="inline-flex min-w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-600">
              pcs
            </span>
          </div>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Harga</span>
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Stok</span>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <div className="md:col-span-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Foto produk</span>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 transition hover:border-slate-400 hover:bg-slate-100">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:shadow-sm"
              />
            </div>
          </label>
        </div>
      </div>

      <label className="mt-3 block space-y-2 text-sm font-medium text-slate-700">
        <span>Deskripsi</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          placeholder="Tulis deskripsi produk..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <label className="mt-3 block space-y-2 text-sm font-medium text-slate-700">
        <span>Fitur (pisahkan dengan koma)</span>
        <input
          value={form.features}
          onChange={(event) => updateField("features", event.target.value)}
          placeholder="Contoh: Garansi 1 tahun, Free ongkir"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          {saving ? "Menyimpan..." : "Tambah produk"}
        </button>
      </div>
    </form>
  );
}
