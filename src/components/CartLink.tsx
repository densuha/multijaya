"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/keranjang" className="relative hover:text-amber-700">
      Keranjang
      {count > 0 ? (
        <span className="absolute -right-3 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
