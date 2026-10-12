import { BRAND, CONTACT } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { Icon } from './Icons';
import LangToggle from './LangToggle';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-wine/25 blur-3xl" />
      <div className="container-x relative flex flex-col items-center gap-7 py-14 text-center">
        <img src="/logo-badge.png" alt={BRAND.name} className="h-20 w-20 rounded-full" style={{ boxShadow: '0 0 40px rgba(198,161,91,.35)' }} loading="lazy" draggable="false" />
        <p className="script text-3xl text-gold-light">{t.footer.tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"><Icon name="instagram" /></a>
          <a href="#inicio" aria-label={t.footer.top} className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"><Icon name="arrowUp" /></a>
          <LangToggle dark />
        </div>
        <p className="text-xs text-cream/45">© {new Date().getFullYear()} {BRAND.name} · Bucaramanga, Colombia. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
