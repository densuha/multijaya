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
      setMessage(data.message ?? "Produk berhasil ditambahkan.");
      router.refresh();
    } catch {
      setMessage("Gagal menambahkan produk.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tambah produk baru</h2>
          <p className="text-sm text-slate-500">Data akan langsung masuk ke database MySQL Laragon.</p>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-emerald-700">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-600">
          <span>Nama produk</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Kategori</span>
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
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Slug</span>
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="opsional, auto dari nama"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Satuan</span>
          <input
            value={form.unit}
            onChange={(event) => updateField("unit", event.target.value)}
            placeholder="pcs / box / set"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Harga</span>
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Stok</span>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Foto produk</span>
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
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
        />
      </label>

      <label className="mt-4 block space-y-1 text-sm text-slate-600">
        <span>Fitur (pisahkan dengan koma)</span>
        <input
          value={form.features}
          onChange={(event) => updateField("features", event.target.value)}
          placeholder="Contoh: Garansi 1 tahun, Free ongkir"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
        />
      </label>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Menyimpan..." : "Tambah produk"}
        </button>
      </div>
    </form>
  );
}
