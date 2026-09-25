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
      <h1 className="text-2xl font-bold text-slate-900">Login admin</h1>
      <p className="mt-2 text-sm text-slate-500">Masukkan username dan password admin.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username admin"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password admin"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
