"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/produk", label: "Produk & harga" },
    { href: "/admin/kategori", label: "Kategori" },
    { href: "/admin/banner", label: "Banner" },
    { href: "/admin/setelan", label: "Setting" },
  
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:sticky lg:top-5">
      <div className="px-3 pb-3 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Navigasi utama</p>
      </div>
      <nav className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-2xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-slate-900 font-semibold text-white shadow-md shadow-slate-900/10"
                  : "font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
