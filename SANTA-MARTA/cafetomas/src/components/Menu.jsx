import { useMemo, useRef, useState } from 'react';
import Img from './Img';
import { CATS, MENU } from '../data';
import { contactLink, useI18n } from '../i18n';
import { useInView } from '../lib/scroll';

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}

export function DishCard({ m, i = 0 }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <article className="dish" style={{ '--k': i }}>
      <div className="dish-photo"><Img id={m.img} alt={pick(m.n)} w={480} sizes="160px" className="h-full w-full" /></div>
      <div className="dish-body">
        <div className="dish-top"><h3>{pick(m.n)}</h3><b>{fmt.format(m.price)}</b></div>
        <p>{pick(m.d)}</p>
        <div className="dish-tags">
          {m.fav && <span className="tg-fav">★ {t.menu.fav}</span>}
          <a href={contactLink(t.menu.orderMsg(pick(m.n)))} target="_blank" rel="noopener noreferrer" className="dish-order">{t.menu.order} →</a>
        </div>
      </div>
    </article>
  );
}

export function Grid3D({ items }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return <div ref={ref} className={`menu-grid ${seen ? 'in' : ''}`}>{items.map((m, i) => <DishCard key={m.id} m={m} i={i} />)}</div>;
}

export default function Menu() {
  const { t } = useI18n();
  const [cat, setCat] = useState('espresso');
  return (
    <section id="carta" className="menu-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">{t.menu.eyebrow}</p>
            <h2 className="rv mask-up sec-title mt-3"><span>{t.menu.title}</span></h2>
          </div>
          <p className="rv max-w-[42ch] text-[15.5px] leading-relaxed opacity-75">{t.menu.lead}</p>
        </div>
        <div className="menu-tabs no-scrollbar" role="tablist" aria-label={t.menu.eyebrow}>
          {CATS.map((c) => <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{t.menu.cats[c]}</button>)}
        </div>
        <Grid3D key={cat} items={MENU.filter((m) => m.cat === cat)} />
        <div className="mt-12 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-purple">{t.menu.full} ↗</a>
        </div>
      </div>
    </section>
  );
}
