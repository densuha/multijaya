import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");

  return (
    <main className="w-full pb-12">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">
        Ringkasan panel admin untuk mengelola produk, kategori, dan setelan website.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kategori</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Kelola</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Produk</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Tambah & edit</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Setelan</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">WhatsApp</p>
        </div>
      </div>
    </main>
  );
}
