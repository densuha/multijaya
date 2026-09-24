import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { formatRupiah } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: `${product.name} — ${formatRupiah(product.price)} per ${product.unit}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(slug);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/produk" className="text-sm text-amber-700 hover:underline">
        ← Kembali ke katalog
      </Link>

      <article className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 p-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <p className="text-sm text-slate-400">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-3 text-slate-600">{product.description}</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-3xl font-bold text-amber-700">
              {formatRupiah(product.price)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              per {product.unit} · stok tersedia {product.stock} · rating {product.rating}
            </p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="text-amber-600">•</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <AddToCartButton
              product={product}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            />
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Produk serupa</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
