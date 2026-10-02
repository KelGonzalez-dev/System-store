import { useEffect, useRef, useState } from 'react';
import { LogoBadge, Wordmark } from './Brand';
import { LangPicker } from './Nav';
import LangSwitch from './LangSwitch';
import { DishCard, OffMenu } from './Menu';
import { FloatChat, Footer } from './Visit';
import { GROUPS, LOCAL, MENU } from '../data';
import { useI18n } from '../i18n';

const OFFSET = 128;

// Página independiente con la carta completa: categorías con foto de cada plato
export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState('burgers');
  const bar = useRef(null);

  useEffect(() => { document.title = `${t.menu.title} | The Marquesa`; }, [t]);

  // Si se abrió con #cat-xxx (desde el inicio), baja a esa categoría
  useEffect(() => {
    const h = window.location.hash;
    if (!h.startsWith('#cat-')) return;
    const el = document.querySelector(h);
    if (el) setTimeout(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET, behavior: 'auto' }), 60);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.cat); });
    }, { rootMargin: '-35% 0px -60% 0px' });
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
          <a href="./" className="flex items-center gap-3" aria-label="The Marquesa">
            <LogoBadge className="w-9" /><Wordmark className="text-[14px]" />
          </a>
          <div className="flex items-center gap-2.5">
            <a href="./" className="nav-link hidden md:inline-block">← {t.menu.back}</a>
            <LangPicker />
            <a href="./#visitanos" className="btn btn-neon hidden !h-10 !px-6 sm:inline-flex">{t.nav.reserve}</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-noche pb-14 pt-[calc(130px+env(safe-area-inset-top,0px))]">
        <div className="hero-bg is-static" aria-hidden="true"><img src={LOCAL.fondo} alt="" /></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap relative">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="sec-title mt-3 text-hueso">{t.menu.title}</h1>
          <p className="mt-2 font-script text-[clamp(34px,4vw,54px)] leading-none neon-script">Burgers &amp; Chill</p>
          <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed text-hueso/75">{t.menu.lead}</p>
        </div>
      </section>

      <nav className="cat-bar" aria-label={t.menu.title}>
        <div ref={bar} className="wrap no-scrollbar flex items-center gap-1 overflow-x-auto">
          {Object.entries(GROUPS).map(([g, cats]) => (
            <div key={g} className="flex shrink-0 items-center gap-1">
              <span className="cat-group font-script">{t.menu[g]}</span>
              {cats.map((c) => (
                <a key={c} href={`#cat-${c}`} data-chip={c} onClick={go(c)} className={`cat-chip ${active === c ? 'on' : ''}`}>{t.menu.cats[c]}</a>
              ))}
            </div>
          ))}
        </div>
      </nav>

      <main className="menu-page pb-24">
        {Object.entries(GROUPS).map(([g, cats]) => (
          <div key={g} className="wrap">
            <h2 className="group-title font-display">{t.menu[g]}</h2>
            {cats.map((c) => (
              <section key={c} id={`cat-${c}`} data-cat={c} className="cat-sec">
                <h3 className="cat-title font-display">{t.menu.cats[c]}</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {MENU.filter((m) => m.cat === c).map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
                </div>
              </section>
            ))}
          </div>
        ))}
        <div className="wrap mt-16"><OffMenu /></div>
        <p className="wrap mt-8 text-[14px] text-noche/60">{t.menu.note}</p>
      </main>

      <Footer />
      <FloatChat />
      <LangSwitch />
    </>
  );
}
