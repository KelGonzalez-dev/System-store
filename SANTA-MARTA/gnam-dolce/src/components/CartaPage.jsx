import { useEffect, useRef, useState } from 'react';
import Img from './Img';
import { GnamLogo, Swoosh } from './Brand';
import { LangToggle } from './Nav';
import LangSwitch from './LangSwitch';
import { useMoney } from './Menu';
import { FloatBook, Footer } from './Visit';
import { CARTA, GROUPS } from '../data';
import { useI18n, wa } from '../i18n';
import { useInView } from '../lib/scroll';

const OFFSET = 140;

function Category({ c }) {
  const { pick } = useI18n();
  const fmt = useMoney();
  const ref = useRef(null);
  const seen = useInView(ref);
  const withDesc = c.items.some((x) => x[1]);
  return (
    <section id={`cat-${c.id}`} data-cat={c.group} className="cat-sec">
      <div className="cat-head">
        <h3>{pick(c.n)}</h3>
        {c.note && <p>{pick(c.note)}</p>}
      </div>
      <div ref={ref} className={`citems ${withDesc ? 'rich' : 'list'} ${seen ? 'in' : ''}`}>
        {c.items.map((x, i) => (
          <article key={x[0]} className="citem" style={{ '--k': i }}>
            {withDesc && <div className="ci-photo"><Img id={c.img[i % c.img.length]} alt={x[0]} w={360} sizes="120px" className="h-full w-full" /></div>}
            <div className="ci-body">
              <div className="ci-top"><h4>{x[0]}</h4><span className="dots" /><b>{fmt.format(x[2])}</b></div>
              {x[1] && <p>{x[1]}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CartaPage() {
  const { t, lang, pick } = useI18n();
  const [active, setActive] = useState(GROUPS[0].id);
  const bar = useRef(null);
  useEffect(() => { document.title = `${t.menu.eyebrow} | Gnam Dolce`; }, [t]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.cat); }), { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('[data-cat]').forEach((n) => io.observe(n));
    if (location.hash) setTimeout(() => { const el = document.querySelector(location.hash); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET }); }, 300);
    return () => io.disconnect();
  }, [lang]);
  const go = (g) => (e) => { e.preventDefault(); const el = document.getElementById(`grp-${g}`); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 8, behavior: 'smooth' }); };
  return (
    <>
      <header className="carta-head">
        <div className="wrap flex items-center justify-between gap-4">
          <a href="./" className="nav-logo" aria-label="Gnam Dolce"><GnamLogo /></a>
          <div className="flex items-center gap-2">
            <a href="./" className="nav-link mr-2 hidden md:inline-block">← {t.menu.back}</a>
            <LangToggle />
            <a href={wa(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-choco hidden !h-11 !px-5 sm:inline-flex">{t.nav.book}</a>
          </div>
        </div>
      </header>
      <section className="carta-hero">
        <div className="hero-damask" aria-hidden="true" />
        <Swoosh className="carta-swoosh" />
        <div className="wrap relative pb-16 pt-[calc(140px+env(safe-area-inset-top,0px))] text-center">
          <div className="mx-auto w-[min(360px,72vw)]"><GnamLogo dolce={false} /></div>
          <p className="carta-year">{t.menu.eyebrow.toUpperCase()}</p>
        </div>
      </section>
      <nav className="cat-bar" aria-label={t.menu.eyebrow}>
        <div ref={bar} className="wrap no-scrollbar flex items-center justify-start gap-2 overflow-x-auto md:justify-center">
          {GROUPS.map((g) => <a key={g.id} href={`#grp-${g.id}`} onClick={go(g.id)} className={`cat-chip ${active === g.id ? 'on' : ''}`}>{pick(g.n)}</a>)}
        </div>
      </nav>
      <main className="carta-main pb-24">
        {GROUPS.map((g) => (
          <div key={g.id} id={`grp-${g.id}`} className="wrap grp">
            <h2 className="grp-title"><span>{pick(g.n)}</span></h2>
            {CARTA.filter((c) => c.group === g.id).map((c) => <Category key={c.id} c={c} />)}
          </div>
        ))}
        <p className="wrap mt-14 text-center text-[13.5px] text-choco/55">{t.menu.note}</p>
      </main>
      <Footer />
      <FloatBook />
      <LangSwitch />
    </>
  );
}
