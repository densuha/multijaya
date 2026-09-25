"use client";

import { useState } from "react";

type BannerSettings = {
  bannerEyebrow: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerImage: string;
  logoImage: string;
};

export function BannerSettingsForm({ initialSettings }: { initialSettings: BannerSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [image, setImage] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof BannerSettings, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("bannerEyebrow", form.bannerEyebrow);
      formData.append("bannerTitle", form.bannerTitle);
      formData.append("bannerDescription", form.bannerDescription);
      if (image) formData.append("bannerImage", image);
      if (logo) formData.append("logoImage", logo);

      const response = await fetch("/api/admin/banner", { method: "POST", body: formData });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        settings?: BannerSettings;
      };

      if (!response.ok) {
        setMessage(data.message ?? "Gagal menyimpan banner.");
        return;
      }

      if (data.settings) setForm(data.settings);
      setImage(null);
      setLogo(null);
      setMessage(data.message ?? "Banner berhasil disimpan.");
    } catch {
      setMessage("Gagal menyimpan banner.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Logo toko</span>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <input type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
          </div>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Teks kecil banner</span>
          <input value={form.bannerEyebrow} onChange={(event) => updateField("bannerEyebrow", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Judul banner</span>
          <input required value={form.bannerTitle} onChange={(event) => updateField("bannerTitle", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Deskripsi banner</span>
          <textarea required rows={3} value={form.bannerDescription} onChange={(event) => updateField("bannerDescription", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Gambar banner</span>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
          </div>
        </label>
      </div>

      {form.bannerImage ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <img src={form.bannerImage} alt="Preview banner" className="h-40 w-full object-cover" />
        </div>
      ) : null}

      {form.logoImage ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <img src={form.logoImage} alt="Preview logo" className="h-12 w-12 rounded-xl object-cover" />
          <p className="text-sm text-slate-600">Logo saat ini</p>
        </div>
      ) : null}

      {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-5 flex justify-end">
        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
          {saving ? "Menyimpan..." : "Simpan banner"}
        </button>
      </div>
    </form>
  );
}
