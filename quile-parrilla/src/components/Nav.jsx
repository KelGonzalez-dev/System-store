import { useEffect, useState } from 'react';
import { QuileLogo } from './Brand';
import { LANGS, useI18n, wa } from '../i18n';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label={t.nav.lang}>
      {LANGS.map((l) => (
        <button key={l.code} type="button" className={lang === l.code ? 'on' : ''} onClick={() => setLang(l.code)} aria-pressed={lang === l.code}>{l.code.toUpperCase()}</button>
      ))}
    </div>
  );
}

const WaIcon = () => <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>;
export { WaIcon };

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
  const links = [['#compartir', t.nav.share], ['#carta', t.nav.menu], ['#lugar', t.nav.place], ['#visitanos', t.nav.visit]];
  const go = (e, h) => { e.preventDefault(); setOpen(false); scrollToTarget(h); };
  return (
    <>
      <header className={`site-nav ${solid ? 'is-solid' : ''}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#inicio" onClick={(e) => go(e, 'body')} className="nav-logo" aria-label="Quile Parrilla"><QuileLogo glow={false} /></a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="nav-link">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle />
            <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-fire hidden !h-11 !px-5 sm:inline-flex"><WaIcon />{t.nav.order}</a>
            <button type="button" className="burger lg:hidden" onClick={() => setOpen(true)} aria-label={t.nav.open} aria-expanded={open}><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'on' : ''}`} aria-hidden={!open}>
        <button type="button" className="mm-close" onClick={() => setOpen(false)} aria-label={t.nav.close} tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-current" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="w-48"><QuileLogo /></div>
        <nav className="mt-8 flex flex-col items-center gap-3" aria-label="Móvil">
          {links.map(([h, l], i) => <a key={h} href={h} tabIndex={open ? 0 : -1} onClick={(e) => go(e, h)} className="mm-link" style={{ '--i': i }}>{l}</a>)}
        </nav>
        <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn btn-fire mt-10"><WaIcon />{t.hero.c1}</a>
      </div>
    </>
  );
}
