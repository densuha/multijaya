import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  
];

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {settings.logoImage ? (
            <img src={settings.logoImage} alt="Logo" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 font-bold text-slate-950">MJ</span>
          )}
          <span>
            <span className="block text-sm font-semibold tracking-tight text-slate-900">
              {settings.storeName}
            </span>
            <span className="block text-xs text-slate-500">Katalog Produk & Harga</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-amber-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
