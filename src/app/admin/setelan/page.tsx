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
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Konfigurasi</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Setelan website</h1>
        <p className="mt-3 text-sm text-slate-500">
        Atur informasi toko, WhatsApp, dan teks footer yang ditampilkan ke publik.
        </p>
      </div>
      <SiteSettingsForm initialSettings={settings} />
      <AccountSettingsForm initialAccount={account} />
    </main>
  );
}
