import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  redirect("/admin/dashboard");
}
