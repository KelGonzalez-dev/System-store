import { useEffect, useState } from 'react';
import { Logo } from './Brand';
import { LANGS, contactLink, useI18n } from '../i18n';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label={t.nav.lang}>
      {LANGS.map((l) => <button key={l.code} type="button" className={lang === l.code ? 'on' : ''} onClick={() => setLang(l.code)} aria-pressed={lang === l.code}>{l.code.toUpperCase()}</button>)}
    </div>
  );
}

export default function Nav() {
  const { t } = useI18n();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 30);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { if (!open) return undefined; lockScroll(true); return () => lockScroll(false); }, [open]);
  const links = [['#grano', t.nav.coffee], ['#lab', t.nav.lab], ['#carta', t.nav.menu], ['#escuela', t.nav.school], ['#galeria', t.nav.gallery], ['#contacto', t.nav.contact]];
  const go = (e, h) => { e.preventDefault(); setOpen(false); scrollToTarget(h); };
  return (
    <>
      <header className={`site-nav ${solid ? 'is-solid' : ''}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#inicio" onClick={(e) => go(e, 'body')} className="brand" aria-label="Cafetomás">
            <span className="brand-logo"><Logo /></span><b>CAFETOMÁS</b>
          </a>
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Principal">
            {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="nav-link">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle />
            <a href={contactLink(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-yellow hidden !h-11 !px-5 sm:inline-flex">{t.nav.cta}</a>
            <button type="button" className="burger xl:hidden" onClick={() => setOpen(true)} aria-label={t.nav.open} aria-expanded={open}><span /><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'on' : ''}`} aria-hidden={!open}>
        <button type="button" className="mm-close" onClick={() => setOpen(false)} aria-label={t.nav.close} tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-current" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="w-28"><Logo /></div>
        <nav className="mt-8 flex flex-col items-center gap-2" aria-label="Móvil">
          {links.map(([h, l], i) => <a key={h} href={h} tabIndex={open ? 0 : -1} onClick={(e) => go(e, h)} className="mm-link" style={{ '--i': i }}>{l}</a>)}
        </nav>
      </div>
    </>
  );
}
