import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/produk/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
            {product.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 pb-0">
          <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
          <div className="mt-auto pt-3">
            <p className="text-lg font-bold text-amber-700">{formatRupiah(product.price)}</p>
            <p className="text-xs text-slate-500">
              per {product.unit} · stok {product.stock}
            </p>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-3">
        <AddToCartButton product={product} className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300" />
      </div>
    </article>
  );
}
