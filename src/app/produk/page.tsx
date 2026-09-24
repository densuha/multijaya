import { ProductCatalog } from "@/components/ProductCatalog";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daftar Produk",
  description: "Semua produk Multijaya beserta harga, stok, dan kategori.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <main className="flex-1">
      <ProductCatalog initialProducts={products} initialCategories={categories} />
    </main>
  );
}
