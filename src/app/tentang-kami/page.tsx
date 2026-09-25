import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Tentang Kami" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}` : "";
  const mapUrl = settings.location.startsWith("http")
    ? settings.location
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`;
  const coordinates = settings.location.match(/@(-?\d+(?:\.\d+)?),(-?\d+)/)
    ?? settings.location.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const mapQuery = coordinates ? `${coordinates[1]},${coordinates[2]}` : settings.location;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <main className="flex-1 bg-slate-50 pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Tentang kami</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{settings.storeName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{settings.storeDescription}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold text-slate-900">Informasi toko</h2>
            <div className="mt-5 divide-y divide-slate-100">
            <div className="py-4 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alamat</p>
              <p className="mt-1 text-sm text-slate-700">{settings.storeAddress}</p>
            </div>
            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Telepon</p>
              {settings.phoneNumber ? <a href={`tel:${settings.phoneNumber}`} className="mt-1 inline-block text-sm font-medium text-slate-700 hover:text-amber-700">{settings.phoneNumber}</a> : <p className="mt-1 text-sm text-slate-500">Belum diatur</p>}
            </div>
            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">WhatsApp</p>
              {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">Chat melalui WhatsApp</a> : <p className="mt-1 text-sm text-slate-500">Belum diatur</p>}
            </div>
            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
              {settings.email ? <a href={`mailto:${settings.email}`} className="mt-1 inline-block text-sm font-medium text-slate-700 hover:text-amber-700">{settings.email}</a> : <p className="mt-1 text-sm text-slate-500">Belum diatur</p>}
            </div>
            <div className="py-4 last:pb-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lokasi</p>
              {settings.location ? <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-medium text-amber-700 hover:text-amber-800">Buka lokasi di Google Maps</a> : <p className="mt-1 text-sm text-slate-500">Belum diatur</p>}
            </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Lokasi toko</h2>
              <p className="mt-1 text-sm text-slate-500">Temukan kami melalui Google Maps.</p>
            </div>
            {settings.location ? (
              <iframe
                title="Lokasi toko di Google Maps"
                src={mapEmbedUrl}
                className="h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="grid h-[360px] place-items-center px-6 text-center text-sm text-slate-500">
                Lokasi belum diatur melalui menu Setelan Admin.
              </div>
            )}
            {settings.location ? <a href={mapUrl} target="_blank" rel="noreferrer" className="block border-t border-slate-100 px-5 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50">Buka di Google Maps</a> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
