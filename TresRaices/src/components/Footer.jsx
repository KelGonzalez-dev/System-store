import { BRAND, CONTACT, NAV, SLOGANS } from '../data/content';
import { Icon } from './Icons';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leaf/30 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-cream p-2.5">
              <img src="/logo.webp" alt="Tres Raíces" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{BRAND.name}</p>
              <p className="text-sm font-semibold text-lime">{BRAND.type}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            {BRAND.legal}. <span className="font-semibold text-white">{BRAND.sigla}</span>
          </p>
          <p className="mt-6 font-script text-3xl text-gold-light">{SLOGANS.foot}</p>
        </div>

        <div className="md:col-span-3">
          <p className="font-display text-lg font-bold">Enlaces rápidos</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="transition-colors hover:text-gold-light">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-display text-lg font-bold">Contáctanos</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-lime" />{CONTACT.place}</li>
            <li className="flex items-center gap-3"><Icon name="phone" className="h-5 w-5 shrink-0 text-lime" /><a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a></li>
            <li className="flex items-center gap-3"><Icon name="mail" className="h-5 w-5 shrink-0 text-lime" /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[['facebook', CONTACT.facebook, 'Facebook'], ['instagram', CONTACT.instagram, 'Instagram'], ['youtube', CONTACT.youtube, 'YouTube']].map(([n, href, label]) => (
              <a key={n} href={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors hover:border-gold-light hover:bg-gold-light hover:text-forest">
                <Icon name={n} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {BRAND.name} {BRAND.type}. Todos los derechos reservados.</p>
          <button type="button" onClick={() => window.dispatchEvent(new Event('open-cookies'))} className="font-semibold underline underline-offset-4 hover:text-gold-light">
            Preferencias de cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
