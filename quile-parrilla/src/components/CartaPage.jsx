import { useEffect, useRef, useState } from 'react';
import { QuileLogo } from './Brand';
import { LangToggle, WaIcon } from './Nav';
import LangSwitch from './LangSwitch';
import { DishCard } from './Menu';
import { FloatWA, Footer } from './Visit';
import { Embers } from './Hero';
import { CATS, MENU } from '../data';
import { useI18n, wa } from '../i18n';

const OFFSET = 136;

// Carta completa en su propia pestaña: categorías con foto de cada plato
export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(CATS[0]);
  const bar = useRef(null);
  useEffect(() => { document.title = `${t.menu.eyebrow} | Quile Parrilla Riohacha`; }, [t]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.cat); }), { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('[data-cat]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [lang]);
  useEffect(() => {
    const b = bar.current?.querySelector(`[data-chip="${active}"]`);
    if (b) bar.current.scrollTo({ left: b.offsetLeft - 24, behavior: 'smooth' });
  }, [active]);
  const go = (c) => (e) => {
    e.preventDefault();
    const el = document.getElementById(`cat-${c}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 8, behavior: 'smooth' });
  };
  return (
    <>
      <header className="carta-head">
        <div className="wrap flex items-center justify-between gap-4">
          <a href="./" className="nav-logo" aria-label="Quile Parrilla"><QuileLogo glow={false} /></a>
          <div className="flex items-center gap-2">
            <a href="./" className="nav-link mr-2 hidden md:inline-block">← {t.menu.back}</a>
            <LangToggle />
            <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-fire hidden !h-11 !px-5 sm:inline-flex"><WaIcon />{t.nav.order}</a>
          </div>
        </div>
      </header>
      <section className="carta-hero relative overflow-hidden">
        <div className="hero-bg" aria-hidden="true" />
        <Embers count={45} />
        <div className="wrap relative pb-14 pt-[calc(130px+env(safe-area-inset-top,0px))] text-center">
          <p className="eyebrow justify-center">{t.hero.eyebrow}</p>
          <h1 className="sec-title mt-3 text-crema">{t.menu.eyebrow}</h1>
          <p className="mt-1 font-script text-[clamp(32px,4vw,48px)] leading-none text-fuego">{t.loader.tag}</p>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-crema/70">{t.menu.lead}</p>
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
            <h2 className="cat-title"><span>{t.menu.cats[c]}</span></h2>
            <div className="menu-grid">
              {MENU.filter((m) => m.cat === c).map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
            </div>
          </section>
        ))}
        <p className="wrap mt-14 text-[13.5px] text-madera/60">{t.menu.note}</p>
      </main>
      <Footer />
      <FloatWA />
      <LangSwitch />
    </>
  );
}
