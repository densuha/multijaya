import { logoutAdmin } from "@/app/admin/actions";
import { AdminSidebar } from "@/app/admin/AdminSidebar";
import { isAdminLoggedIn } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdminLoggedIn();

  return (
    <div className="flex-1 bg-slate-100">
      {loggedIn ? (
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                Panel Admin
              </p>
              <p className="text-sm text-slate-500">Multijaya</p>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:text-red-600"
              >
                Keluar
              </button>
            </form>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
            <AdminSidebar />

            <div>{children}</div>
          </div>
        </div>
      ) : null}
      {!loggedIn ? children : null}
    </div>
  );
}
