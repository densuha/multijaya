import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-slate-500">
        Produk atau halaman yang Anda cari tidak ada di katalog Multijaya.
      </p>
      <Link
        href="/produk"
        className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
      >
        Kembali ke katalog
      </Link>
    </main>
  );
}
