"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

const STORAGE_KEY = "mj_cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        setItems([]);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      total,
      addItem: (product, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.stock, item.quantity + quantity),
                    price: product.price,
                    stock: product.stock,
                  }
                : item,
            );
          }
          return [
            ...current,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              unit: product.unit,
              image: product.image,
              quantity: Math.min(product.stock, quantity),
              stock: product.stock,
            },
          ];
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          current
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus dipakai di dalam CartProvider");
  return context;
}
