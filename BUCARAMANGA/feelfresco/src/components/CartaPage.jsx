import { useEffect, useRef, useState } from 'react';
import { Brand, LangPicker } from './Nav';
import LangSwitch from './LangSwitch';
import { DishCard } from './Menu';
import { FloatOrder, Footer } from './Reserve';
import Palm from './Palm';
import { CATS, MENU } from '../data';
import { useI18n } from '../i18n';

const OFFSET = 132;

// Menú completo en su propia página: categorías con foto de cada producto
export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(CATS[0]);
  const bar = useRef(null);
  useEffect(() => { document.title = `${t.menu.title} | Feel Fresco`; }, [t]);
  useEffect(() => {
    const h = window.location.hash;
    if (!h.startsWith('#cat-')) return;
    const el = document.querySelector(h);
    if (el) setTimeout(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET, behavior: 'auto' }), 60);
  }, []);
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
          <a href="./" aria-label="Feel Fresco"><Brand small /></a>
          <div className="flex items-center gap-2.5">
            <a href="./" className="nav-link hidden md:inline-block">← {t.menu.back}</a>
            <LangPicker />
            <a href="./#reservas" className="btn btn-red hidden !h-11 !px-5 !text-[15px] sm:inline-flex">{t.nav.reserve}</a>
          </div>
        </div>
      </header>
      <section className="hero relative overflow-hidden pb-16 pt-[calc(140px+env(safe-area-inset-top,0px))]">
        <div className="sunburst" aria-hidden="true" />
        <Palm className="hero-palm hp-r" />
        <div className="wrap relative">
          <span className="eyebrow-sticker">Smash burgers · Bucaramanga</span>
          <h1 className="sec-title mt-4 text-rojo">{t.menu.title}</h1>
          <p className="mt-1 font-script text-[clamp(34px,4vw,52px)] leading-none text-crema retro-script">Feel Fresco</p>
          <p className="mt-5 max-w-[54ch] text-[16px] font-medium leading-relaxed text-vino/85">{t.menu.lead}</p>
        </div>
      </section>
      <nav className="cat-bar" aria-label={t.menu.title}>
        <div ref={bar} className="wrap no-scrollbar flex items-center gap-2 overflow-x-auto">
          {CATS.map((c) => <a key={c} href={`#cat-${c}`} data-chip={c} onClick={go(c)} className={`cat-chip ${active === c ? 'on' : ''}`}>{t.menu.cats[c]}</a>)}
        </div>
      </nav>
      <main className="bg-crema pb-24">
        {CATS.map((c) => (
          <section key={c} id={`cat-${c}`} data-cat={c} className="wrap cat-sec">
            <h2 className="cat-title font-display">{t.menu.cats[c]}</h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {MENU.filter((m) => m.cat === c).map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
            </div>
          </section>
        ))}
        <p className="wrap mt-14 text-[14px] text-vino/70">{t.menu.note}</p>
      </main>
      <Footer />
      <FloatOrder />
      <LangSwitch />
    </>
  );
}
