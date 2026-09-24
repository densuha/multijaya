import { redirect } from "next/navigation";

export const metadata = { title: "Pesanan" };

export default async function AdminOrdersPage() {
  redirect("/admin/produk");
}
