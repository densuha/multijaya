import { redirect } from "next/navigation";
import { SiteSettingsForm } from "@/components/SiteSettingsForm";
import { AccountSettingsForm } from "@/components/AccountSettingsForm";
import { getCurrentAdmin, isAdminLoggedIn } from "@/lib/admin";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Setelan website" };

export default async function SiteSettingsPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");

  const settings = await getSiteSettings();
  const account = await getCurrentAdmin();
  if (!account) redirect("/admin/login");

  return (
    <main className="w-full pb-12">
      <h1 className="text-2xl font-bold text-slate-900">Setelan website</h1>
      <p className="mt-2 text-sm text-slate-500">
        Atur informasi toko, WhatsApp, dan teks footer yang ditampilkan ke publik.
      </p>
      <SiteSettingsForm initialSettings={settings} />
      <AccountSettingsForm initialAccount={account} />
    </main>
  );
}
