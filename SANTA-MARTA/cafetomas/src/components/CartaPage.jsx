import { useEffect, useRef, useState } from 'react';
import { Logo } from './Brand';
import { LangToggle } from './Nav';
import LangSwitch from './LangSwitch';
import { Grid3D } from './Menu';
import { FloatCTA, Footer } from './Contact';
import { CATS, MENU } from '../data';
import { contactLink, useI18n } from '../i18n';

const OFFSET = 132;

export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(CATS[0]);
  const bar = useRef(null);
  useEffect(() => { document.title = `${t.menu.eyebrow} | Cafetomás · Café de Especialidad`; }, [t]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.cat); }), { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('[data-cat]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [lang]);
  useEffect(() => { const b = bar.current?.querySelector(`[data-chip="${active}"]`); if (b) bar.current.scrollTo({ left: b.offsetLeft - 24, behavior: 'smooth' }); }, [active]);
  const go = (c) => (e) => { e.preventDefault(); const el = document.getElementById(`cat-${c}`); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 8, behavior: 'smooth' }); };
  return (
    <>
      <header className="carta-head">
        <div className="wrap flex items-center justify-between gap-4">
          <a href="./" className="brand" aria-label="Cafetomás"><span className="brand-logo"><Logo /></span><b>CAFETOMÁS</b></a>
          <div className="flex items-center gap-2">
            <a href="./" className="nav-link mr-2 hidden md:inline-block">← {t.menu.back}</a>
            <LangToggle />
            <a href={contactLink(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-yellow hidden !h-11 !px-5 sm:inline-flex">{t.nav.cta}</a>
          </div>
        </div>
      </header>
      <section className="carta-hero">
        <div className="wrap pb-14 pt-[calc(130px+env(safe-area-inset-top,0px))] text-center">
          <p className="eyebrow justify-center">{t.hero.eyebrow}</p>
          <h1 className="sec-title mt-3">{t.menu.eyebrow}</h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-[16px] leading-relaxed opacity-85">{t.menu.lead}</p>
        </div>
      </section>
      <nav className="cat-bar" aria-label={t.menu.eyebrow}>
        <div ref={bar} className="wrap no-scrollbar flex items-center gap-2 overflow-x-auto">
          {CATS.map((c) => <a key={c} href={`#cat-${c}`} data-chip={c} onClick={go(c)} className={`cat-chip ${active === c ? 'on' : ''}`}>{t.menu.cats[c]}</a>)}
        </div>
      </nav>
      <main className="carta-main pb-24">
        {CATS.map((c) => (
          <section key={c} id={`cat-${c}`} data-cat={c} className="wrap cat-sec">
            <h2 className="cat-title">{t.menu.cats[c]}</h2>
            <Grid3D items={MENU.filter((m) => m.cat === c)} />
          </section>
        ))}
        <p className="wrap mt-14 text-[13.5px] opacity-60">{t.menu.note}</p>
      </main>
      <Footer />
      <FloatCTA />
      <LangSwitch />
    </>
  );
}
