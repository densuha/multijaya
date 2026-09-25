"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setLoading(false);
    if (!response.ok) {
      setError(data.message ?? "Username atau password salah.");
      return;
    }
    router.push("/admin/produk");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-lg font-bold text-amber-400 shadow-xl shadow-slate-900/15">MJ</div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Panel admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Selamat datang kembali</h1>
        <p className="mt-2 text-sm text-slate-500">Masukkan username dan password admin.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username admin"
          autoComplete="username"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password admin"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
