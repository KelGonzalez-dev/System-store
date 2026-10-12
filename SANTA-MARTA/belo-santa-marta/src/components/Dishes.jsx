import { useMemo, useRef } from 'react';
import Img from './Img';
import { Deco } from './Brand';
import { DISH_IDS, MENU } from '../data';
import { useI18n, wa } from '../i18n';
import { useInView, useTilt } from '../lib/scroll';

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}
const byId = (id) => MENU.find((m) => m.id === id);

function DishTile({ m, i }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  const ref = useRef(null);
  useTilt(ref, 9);
  return (
    <article ref={ref} className="dtile" style={{ '--k': i }}>
      <div className="dt-photo"><Img id={m.img} alt={pick(m.n)} w={700} className="h-full w-full" /><span className="glare" /></div>
      <div className="dt-body">
        {m.isNew && <span className="dt-new">{t.menu.new}</span>}
        <h3>{pick(m.n)}</h3>
        <p>{pick(m.d)}</p>
        <div className="dt-foot"><b>{fmt.format(m.price)}</b><a href={wa(t.menu.orderMsg(pick(m.n)))} target="_blank" rel="noopener noreferrer">{t.dishes.order} →</a></div>
      </div>
    </article>
  );
}

export default function Dishes() {
  const { t } = useI18n();
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section id="platos" className="dishes-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="sec-head">
          <Deco />
          <div>
            <p className="eyebrow justify-center">{t.dishes.eyebrow}</p>
            <h2 className="rv mask-up sec-title"><span>{t.dishes.title}</span></h2>
          </div>
          <Deco />
        </div>
        <div ref={ref} className={`dish-grid ${seen ? 'in' : ''}`}>
          {DISH_IDS.map((id, i) => <DishTile key={id} m={byId(id)} i={i} />)}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-line">{t.menu.full} ↗</a>
        </div>
      </div>
    </section>
  );
}
