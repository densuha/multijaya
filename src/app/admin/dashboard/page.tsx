import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");

  return (
    <main className="w-full pb-12">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Ringkasan toko</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Ringkasan panel admin untuk mengelola produk, kategori, dan setelan website.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Kategori</p><span className="rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">01</span></div>
          <p className="mt-5 text-xl font-bold text-slate-900">Kelola kategori</p>
          <p className="mt-1 text-sm text-slate-500">Atur pengelompokan produk</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Produk</p><span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">02</span></div>
          <p className="mt-5 text-xl font-bold text-slate-900">Tambah & edit</p>
          <p className="mt-1 text-sm text-slate-500">Harga, stok, foto, dan detail</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Setelan</p><span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">03</span></div>
          <p className="mt-5 text-xl font-bold text-slate-900">WhatsApp & brand</p>
          <p className="mt-1 text-sm text-slate-500">Informasi toko dan akun</p>
        </div>
      </div>
    </main>
  );
}
