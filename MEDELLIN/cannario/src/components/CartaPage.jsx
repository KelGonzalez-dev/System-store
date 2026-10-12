import { useEffect, useRef, useState } from 'react';
import Logo, { GoldDefs } from './Logo';
import { LangPicker } from './Nav';
import LangSwitch from './LangSwitch';
import { DishCard } from './Menu';
import { Footer, WhatsApp } from './Reserve';
import { GROUPS, HERO_BG, MENU } from '../data';
import { useI18n } from '../i18n';

// Página independiente con la carta completa: categorías con foto de cada plato
export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState('mezze');
  const bar = useRef(null);

  useEffect(() => { document.title = `${t.menu.title} | Cannario Rooftop`; }, [t]);

  // Marca la categoría que se está viendo en la barra superior
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.cat); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('[data-cat]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [lang]);

  // Mantiene visible la categoría activa dentro de la barra deslizable (móvil)
  useEffect(() => {
    const b = bar.current?.querySelector(`[data-chip="${active}"]`);
    if (b) bar.current.scrollTo({ left: b.offsetLeft - 20, behavior: 'smooth' });
  }, [active]);

  const go = (c) => (e) => {
    e.preventDefault();
    const el = document.getElementById(`cat-${c}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
  };

  return (
    <>
      <GoldDefs />
      <header className="carta-head">
        <div className="wrap flex items-center justify-between gap-4">
          <a href="./" className="flex items-center gap-2.5" aria-label="Cannario">
            <Logo className="w-7" />
            <span className="font-display text-[24px] leading-none">cannario</span>
          </a>
          <div className="flex items-center gap-2.5">
            <a href="./" className="nav-link hidden md:inline-block">← {t.menu.back}</a>
            <LangPicker />
            <a href="./#reservas" className="btn btn-ghost-light hidden !h-10 !px-6 !text-[12.5px] uppercase !tracking-[0.18em] sm:inline-flex">{t.nav.reserve}</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ash-deep pb-14 pt-[calc(130px+env(safe-area-inset-top,0px))] text-stone-soft">
        <div className="absolute inset-0 opacity-50" aria-hidden="true"><img src={HERO_BG} alt="" className="h-full w-full object-cover" /></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap relative">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="sec-title mt-4 font-display">{t.menu.title}</h1>
          <p className="mt-4 max-w-[52ch] text-[17px] font-light leading-relaxed text-stone/80">{t.menu.lead}</p>
        </div>
      </section>

      <nav className="cat-bar" aria-label={t.menu.title}>
        <div ref={bar} className="wrap no-scrollbar flex items-center gap-1 overflow-x-auto">
          {Object.entries(GROUPS).map(([g, cats]) => (
            <div key={g} className="flex shrink-0 items-center gap-1">
              <span className="cat-group">{t.menu[g]}</span>
              {cats.map((c) => (
                <a key={c} href={`#cat-${c}`} data-chip={c} onClick={go(c)} className={`cat-chip ${active === c ? 'on' : ''}`}>{t.menu.cats[c]}</a>
              ))}
            </div>
          ))}
        </div>
      </nav>

      <main className="bg-stone pb-24">
        {Object.entries(GROUPS).map(([g, cats]) => (
          <div key={g} className="wrap">
            <h2 className="group-title font-display">{t.menu[g]}</h2>
            {cats.map((c) => (
              <section key={c} id={`cat-${c}`} data-cat={c} className="cat-sec">
                <h3 className="cat-title font-display">{t.menu.cats[c]}</h3>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {MENU.filter((m) => m.cat === c).map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
                </div>
              </section>
            ))}
          </div>
        ))}
        <p className="wrap mt-16 text-[14px] italic text-mute">{t.menu.note}</p>
      </main>

      <Footer />
      <WhatsApp show />
      <LangSwitch />
    </>
  );
}
