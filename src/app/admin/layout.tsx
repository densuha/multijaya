import { logoutAdmin } from "@/app/admin/actions";
import { AdminSidebar } from "@/app/admin/AdminSidebar";
import { isAdminLoggedIn } from "@/lib/admin";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdminLoggedIn();
  const settings = loggedIn ? await getSiteSettings() : null;

  return (
    <div className="min-h-full flex-1 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.10),_transparent_32%),#f1f5f9]">
      {loggedIn ? (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              {settings?.logoImage ? (
                <img src={settings.logoImage} alt="Logo" className="h-10 w-10 rounded-2xl object-cover shadow-lg shadow-slate-900/10" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm font-bold text-amber-400 shadow-lg shadow-slate-900/10">MJ</div>
              )}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">Panel admin</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{settings?.storeName ?? "Multijaya"} workspace</p>
              </div>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Keluar
              </button>
            </form>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <AdminSidebar />

            <div>{children}</div>
          </div>
        </div>
      ) : null}
      {!loggedIn ? children : null}
    </div>
  );
}
