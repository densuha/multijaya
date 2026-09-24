import { getSiteSettings } from "@/lib/site-settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {settings.storeName}. {settings.footerText}
        </p>
        <p>{settings.storeDescription}</p>
      </div>
    </footer>
  );
}
