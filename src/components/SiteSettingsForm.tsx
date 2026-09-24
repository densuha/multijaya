"use client";

import { useState } from "react";

type Settings = {
  whatsappNumber: string;
  storeName: string;
  storeDescription: string;
  footerText: string;
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
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Setelan website</h2>
      <p className="mt-1 text-sm text-slate-500">Atur nomor WhatsApp dan teks branding utama.</p>

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-600">
          <span>Nama toko</span>
          <input
            value={form.storeName}
            onChange={(event) => updateField("storeName", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Nomor WhatsApp</span>
          <input
            value={form.whatsappNumber}
            onChange={(event) => updateField("whatsappNumber", event.target.value)}
            placeholder="6281234567890"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Deskripsi toko</span>
          <textarea
            value={form.storeDescription}
            onChange={(event) => updateField("storeDescription", event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Footer text</span>
          <input
            value={form.footerText}
            onChange={(event) => updateField("footerText", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Menyimpan..." : "Simpan pengaturan"}
        </button>
      </div>
    </form>
  );
}
