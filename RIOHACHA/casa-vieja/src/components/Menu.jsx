import { useMemo, useRef, useState } from 'react';
import Img from './Img';
import { CATS, MENU } from '../data';
import { useI18n, wa } from '../i18n';
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
      <div className="dish-photo"><Img id={m.img} alt={pick(m.n)} w={480} sizes="(max-width: 640px) 34vw, 180px" className="h-full w-full" /></div>
      <div className="dish-body">
        <div className="dish-top"><h3>{pick(m.n)}</h3><span className="dish-dots" aria-hidden="true" /><b>{fmt.format(m.price)}</b></div>
        <p>{pick(m.d)}</p>
        <div className="dish-tags">
          {m.fav && <span className="tg-fav">★ {t.menu.fav}</span>}
          <a href={wa(t.menu.orderMsg(pick(m.n)))} target="_blank" rel="noopener noreferrer" className="dish-order">{t.menu.order} →</a>
        </div>
      </div>
    </article>
  );
}

// Grilla que voltea sus platos en 3D cuando entra en pantalla
export function Grid3D({ items }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return <div ref={ref} className={`menu-grid menu-3d ${seen ? 'in' : ''}`}>{items.map((m, i) => <DishCard key={m.id} m={m} i={i} />)}</div>;
}

export default function Menu() {
  const { t } = useI18n();
  const [cat, setCat] = useState('cafe');
  const items = MENU.filter((m) => m.cat === cat).slice(0, 6);
  return (
    <section id="carta" className="menu-sec relative overflow-hidden">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">{t.menu.eyebrow}</p>
            <h2 className="rv mask-up sec-title mt-3"><span>{t.menu.title}</span></h2>
          </div>
          <p className="rv max-w-[42ch] text-[15.5px] leading-relaxed text-cafe/75">{t.menu.lead}</p>
        </div>
        <div className="menu-tabs no-scrollbar" role="tablist" aria-label={t.menu.eyebrow}>
          {CATS.map((c) => <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{t.menu.cats[c]}</button>)}
        </div>
        <Grid3D key={cat} items={items} />
        <div className="mt-12 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-coffee">
            {t.menu.full}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
