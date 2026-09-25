"use client";

import { useState } from "react";

type Settings = {
  whatsappNumber: string;
  storeName: string;
  storeDescription: string;
  footerText: string;
  storeAddress: string;
  phoneNumber: string;
  email: string;
  location: string;
};

export function SiteSettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [form, setForm] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof Settings, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = (await response.json().catch(() => ({ message: "Gagal menyimpan pengaturan." }))) as {
      message?: string;
    };

    setSaving(false);
    setMessage(data.message ?? "Pengaturan disimpan.");
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Informasi website</h2>
      <p className="mt-1 text-sm text-slate-500">Atur nomor WhatsApp dan teks branding utama.</p>

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-600">
          <span>Nama toko</span>
          <input
            value={form.storeName}
            onChange={(event) => updateField("storeName", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Nomor WhatsApp</span>
          <input
            value={form.whatsappNumber}
            onChange={(event) => updateField("whatsappNumber", event.target.value)}
            placeholder="6281234567890"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Nomor telepon</span>
          <input value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="0211234567" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="info@toko.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Alamat toko</span>
          <input value={form.storeAddress} onChange={(event) => updateField("storeAddress", event.target.value)} placeholder="Alamat lengkap toko" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Koordinat lokasi</span>
          <input
            pattern="^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$"
            title="Gunakan format latitude,longitude. Contoh: -6.7199449,107.9489682"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="-6.7199449,107.9489682"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
          <p className="text-xs text-slate-400">Masukkan latitude dan longitude, dipisahkan koma.</p>
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Deskripsi toko</span>
          <textarea
            value={form.storeDescription}
            onChange={(event) => updateField("storeDescription", event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Footer text</span>
          <input
            value={form.footerText}
            onChange={(event) => updateField("footerText", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Menyimpan..." : "Simpan pengaturan"}
        </button>
      </div>
    </form>
  );
}
