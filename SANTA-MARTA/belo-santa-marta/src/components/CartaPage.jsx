import { useEffect, useRef, useState } from 'react';
import Img from './Img';
import { Deco, Wordmark } from './Brand';
import { LangToggle } from './Nav';
import LangSwitch from './LangSwitch';
import { useMoney } from './Dishes';
import { FloatWA, Footer } from './Visit';
import { CATS, MENU } from '../data';
import { MENU_URL, useI18n, wa } from '../i18n';
import { useInView } from '../lib/scroll';

const OFFSET = 132;

function Item({ m, i }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <article className="mitem" style={{ '--k': i }}>
      <div className="mi-photo"><Img id={m.img} alt={pick(m.n)} w={420} sizes="160px" className="h-full w-full" /></div>
      <div className="mi-body">
        <div className="mi-top"><h3>{pick(m.n)}</h3><span className="dots" /><b>{fmt.format(m.price)}</b></div>
        <p>{pick(m.d)}</p>
        <div className="mi-tags">
          {m.isNew && <span className="tg-new">{t.menu.new}</span>}
          {!m.real && <span className="tg-ref">{t.menu.ref}</span>}
          <a href={wa(t.menu.orderMsg(pick(m.n)))} target="_blank" rel="noopener noreferrer">{t.menu.order} →</a>
        </div>
      </div>
    </article>
  );
}

function Group({ items }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return <div ref={ref} className={`mgrid ${seen ? 'in' : ''}`}>{items.map((m, i) => <Item key={m.id} m={m} i={i} />)}</div>;
}

export default function CartaPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(CATS[0]);
  const bar = useRef(null);
  useEffect(() => { document.title = `${t.menu.eyebrow} | BELO · Cocina & Rooftop`; }, [t]);
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
          <a href="./" className="nav-logo" aria-label="BELO"><Wordmark /></a>
          <div className="flex items-center gap-2">
            <a href="./" className="nav-link mr-2 hidden md:inline-block">← {t.menu.back}</a>
            <LangToggle />
            <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold hidden !h-11 !px-5 sm:inline-flex">{t.nav.book}</a>
          </div>
        </div>
      </header>
      <section className="carta-hero">
        <div className="wrap pb-12 pt-[calc(130px+env(safe-area-inset-top,0px))] text-center">
          <div className="sec-head"><Deco /><h1 className="sec-title">{t.menu.title}</h1><Deco /></div>
          <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] leading-relaxed text-crema/65">{t.menu.lead}</p>
          <a href={MENU_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-[13px] font-bold uppercase tracking-[0.2em] text-oro ulink">{t.menu.digital} ↗</a>
        </div>
      </section>
      <nav className="cat-bar" aria-label={t.menu.title}>
        <div ref={bar} className="wrap no-scrollbar flex items-center gap-2 overflow-x-auto">
          {CATS.map((c) => <a key={c} href={`#cat-${c}`} data-chip={c} onClick={go(c)} className={`cat-chip ${active === c ? 'on' : ''}`}>{t.menu.cats[c]}</a>)}
        </div>
      </nav>
      <main className="carta-main pb-24">
        {CATS.map((c) => (
          <section key={c} id={`cat-${c}`} data-cat={c} className="wrap cat-sec">
            <h2 className="cat-title"><Deco /><span>{t.menu.cats[c]}</span><Deco /></h2>
            <Group items={MENU.filter((m) => m.cat === c)} />
          </section>
        ))}
        <p className="wrap mt-14 text-[13px] text-crema/50">{t.menu.note}</p>
      </main>
      <Footer />
      <FloatWA />
      <LangSwitch />
    </>
  );
}
