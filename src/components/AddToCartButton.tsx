"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((response) => response.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => undefined);
  }, []);

  const text = encodeURIComponent(
    `Halo, saya ingin menanyakan harga ${product.name} (${product.unit}). Bisa bantu info stok dan harga terbaru?`,
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={
        className ||
        "inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
      }
    >
      Tanya harga via WhatsApp
    </a>
  );
}
