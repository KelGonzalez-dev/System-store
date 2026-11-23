import { BRAND, CONTACT, LOGO, NAV, waLink } from '../data/content';
import { link } from '../router';
import { Icon, WhatsAppIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="hairline border-t bg-ink">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src={LOGO} alt={BRAND.name} className="h-28 w-28 rounded-full border border-gold/40 bg-noir" loading="lazy" draggable="false" />
          <p className="h-display mt-6 text-5xl glow-gold">{BRAND.tagline}</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/55">Perfumes originales, árabes y de nicho. Pide por WhatsApp y recibe en todo el país.</p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow">Navegar</p>
          <ul className="mt-5 space-y-3">
            {NAV.map(([id, label]) => (
              <li key={id}><a {...link(`#${id}`)} className="font-cond text-xl font-semibold uppercase tracking-[.14em] text-ivory/75 transition-colors hover:text-gold">{label}</a></li>
            ))}
            <li><a {...link('#/catalogo')} className="font-cond text-xl font-semibold uppercase tracking-[.14em] text-ivory/75 transition-colors hover:text-gold">Catálogo</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow">Contacto</p>
          <a href={waLink('Hola Rodriguez Perfumería')} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center gap-3 font-display text-4xl text-ivory transition-colors hover:text-gold"><WhatsAppIcon className="h-6 w-6 text-gold" />{CONTACT.phoneDisplay}</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-3 font-cond text-xl font-semibold tracking-[.1em] text-ivory/75 transition-colors hover:text-gold"><Icon name="instagram" className="h-6 w-6 text-gold" />{CONTACT.instagramHandle}</a>
          <a {...link('#inicio')} aria-label="Volver arriba" className="hairline mt-8 grid h-12 w-12 place-items-center rounded-full border transition-colors hover:border-gold hover:text-gold"><Icon name="arrowUp" /></a>
        </div>
      </div>
      <div className="hairline border-t py-5 text-center text-xs text-ivory/40">© {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.</div>
    </footer>
  );
}
