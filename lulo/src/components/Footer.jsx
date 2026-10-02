import { CONTACT } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { Icon } from './Icons';
import LangToggle from './LangToggle';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-neon/10 bg-night">
      <div className="container-x flex flex-col items-center gap-8 py-14 text-center">
        <img src="/logo.webp" alt="Lulo Café Bar" className="h-24 w-24 rounded-full" style={{ boxShadow: '0 0 50px rgba(255,122,47,.4)' }} loading="lazy" draggable="false" />
        <p className="font-serif text-2xl font-light italic text-ember-light">{t.footer.tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-12 w-12 place-items-center rounded-full border border-neon/25 transition-colors hover:border-ember-light hover:text-ember-light"><Icon name="instagram" /></a>
          <a href="#inicio" aria-label={t.footer.top} className="grid h-12 w-12 place-items-center rounded-full border border-neon/25 transition-colors hover:border-ember-light hover:text-ember-light"><Icon name="arrowUp" /></a>
          <LangToggle />
        </div>
        <p className="text-xs text-neon/40">© {new Date().getFullYear()} Lulo Café Bar · Santa Marta. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
