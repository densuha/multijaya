"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image: string;
};

export function CategoryManager({ products }: { products: Product[] }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    if (response.ok) {
      const data = (await response.json()) as { categories: Category[] };
      setCategories(data.categories);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function addCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Gagal menambahkan kategori.");
      return;
    }

    setName("");
    setMessage(data.message ?? "Kategori berhasil ditambahkan.");
    await loadCategories();
  }

  async function updateCategory(id: string) {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Gagal memperbarui kategori.");
      return;
    }

    setEditingId(null);
    setEditingName("");
    setMessage(data.message ?? "Kategori berhasil diperbarui.");
    await loadCategories();
  }

  async function deleteCategory(id: string) {
    if (!window.confirm("Hapus kategori ini? Produk yang sudah ada tidak akan dihapus.")) return;

    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { message?: string };
    setMessage(data.message ?? "Kategori berhasil dihapus.");
    if (response.ok) await loadCategories();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addCategory} className="flex max-w-xl gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama kategori baru"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
        />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Tambah
        </button>
      </form>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Memuat kategori...</p> : null}
        {!loading && categories.length === 0 ? <p className="text-sm text-slate-500">Belum ada kategori.</p> : null}
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
              {editingId === category.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex-1 text-left text-sm font-medium text-slate-700 hover:text-amber-700"
                >
                  {category.name}
                </button>
              )}
              <div className="flex gap-2">
                {editingId === category.id ? (
                  <>
                    <button type="button" onClick={() => updateCategory(category.id)} className="text-xs font-semibold text-emerald-700">
                      Simpan
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-xs text-slate-500">
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                    className="text-xs font-semibold text-amber-700"
                  >
                    Edit
                  </button>
                )}
                <button type="button" onClick={() => deleteCategory(category.id)} className="text-xs font-semibold text-red-600">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Produk kategori: {selectedCategory}</h2>
              <p className="mt-1 text-sm text-slate-500">Produk yang memakai kategori ini.</p>
            </div>
            <button type="button" onClick={() => setSelectedCategory(null)} className="text-xs text-slate-500">
              Tutup
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((product) => product.category === selectedCategory)
              .map((product) => (
                <div key={product.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{product.stock} {product.unit}</p>
                  </div>
                </div>
              ))}
          </div>
          {products.every((product) => product.category !== selectedCategory) ? (
            <p className="text-sm text-slate-500">Belum ada produk dalam kategori ini.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
