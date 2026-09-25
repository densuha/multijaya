import { redirect } from "next/navigation";
import { BannerSettingsForm } from "@/components/BannerSettingsForm";
import { isAdminLoggedIn } from "@/lib/admin";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Banner" };

export default async function AdminBannerPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const settings = await getSiteSettings();

  return (
    <main className="w-full pb-12">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Banner</h1>
        <p className="mt-2 text-sm text-slate-500">Ubah logo, gambar, dan kata-kata pada halaman depan.</p>
      </div>
      <BannerSettingsForm initialSettings={settings} />
    </main>
  );
}
