"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/produk", label: "Tambah Produk dan harga" },
    { href: "/admin/kategori", label: "Kategori" },
    { href: "/admin/setelan", label: "Setting" },
  
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-3 py-2 text-sm transition ${
                active
                  ? "bg-amber-100 font-semibold text-amber-800"
                  : "font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700"
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
