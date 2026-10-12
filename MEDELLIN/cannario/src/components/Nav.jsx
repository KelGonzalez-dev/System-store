import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { LANGS, useI18n } from '../i18n';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export function LangPicker({ onPick }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open} aria-label={t.nav.lang}
        className="flex h-10 items-center gap-1.5 rounded-full border border-stone/25 px-3.5 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:border-gold">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
        {lang}
      </button>
      <ul role="listbox" aria-label={t.nav.lang} className={`lang-list ${open ? 'on' : ''}`}>
        {LANGS.map((l) => (
          <li key={l.code}>
            <button type="button" role="option" aria-selected={lang === l.code} onClick={() => { setLang(l.code); setOpen(false); onPick?.(); }}
              className={`flex w-full items-center justify-between gap-6 rounded-xl px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-ash/5 ${lang === l.code ? 'text-gold-dark' : 'text-ink'}`}>
              {l.label}<span className="text-xs uppercase text-mute">{l.code}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Nav() {
  const { t } = useI18n();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  const links = [['#experiencia', t.nav.exp], ['#carta', t.nav.menu], ['#galeria', t.nav.gallery], ['#reservas', t.nav.visit]];
  const go = (e, h) => { e.preventDefault(); setOpen(false); scrollToTarget(h); };

  return (
    <>
      <header className={`site-nav ${solid ? 'is-solid' : ''}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#inicio" onClick={(e) => go(e, 'body')} className="flex items-center gap-2.5" aria-label="Cannario, inicio">
            <Logo className="w-7" />
            <span className="font-display text-[25px] leading-none tracking-[0.01em]">cannario</span>
          </a>
          <nav className="hidden items-center gap-8 xl:gap-10 lg:flex" aria-label="Principal">
            {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="nav-link">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2.5">
            <LangPicker />
            <a href="#reservas" onClick={(e) => go(e, '#reservas')} className="btn btn-ghost-light hidden !h-10 !px-6 !text-[12.5px] uppercase !tracking-[0.18em] sm:inline-flex">{t.nav.reserve}</a>
            <button type="button" className="flex h-10 w-10 flex-col items-end justify-center gap-[7px] lg:hidden" onClick={() => setOpen(true)} aria-label={t.nav.open} aria-expanded={open}>
              <span className="block h-px w-6 bg-current" /><span className="block h-px w-4 bg-current" />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "on" : ""}`} aria-hidden={!open}>
        <button type="button" className="absolute right-5 top-[calc(18px+env(safe-area-inset-top,0px))] grid h-11 w-11 place-items-center text-stone" onClick={() => setOpen(false)} aria-label={t.nav.close} tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="1.3"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
        <Logo className="mb-10 w-12" />
        <nav className="flex flex-col items-center gap-6" aria-label="Móvil">
          {links.map(([h, l], i) => <a key={h} href={h} tabIndex={open ? 0 : -1} onClick={(e) => go(e, h)} className="mm-link font-display" style={{ '--i': i }}>{l}</a>)}
        </nav>
        <a href="#reservas" tabIndex={open ? 0 : -1} onClick={(e) => go(e, '#reservas')} className="btn btn-gold mt-12">{t.hero.c1}</a>
      </div>
    </>
  );
}
