import { useMemo, useRef } from 'react';
import Img from './Img';
import { CARTA, GROUPS, L } from '../data';
import { useI18n } from '../i18n';
import { useInView, useTilt } from '../lib/scroll';

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}

const COVER = { cafe: '1461023058943-07fcbe16d735', brunch: L.desayuno, cocina: L.pastas, bebidas: '1546173159-315724a31696', dolce: L.malteadas };

function World({ g, i }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  const ref = useRef(null);
  useTilt(ref, 8);
  const cats = CARTA.filter((c) => c.group === g.id);
  const items = cats.reduce((n, c) => n + c.items.length, 0);
  const min = Math.min(...cats.flatMap((c) => c.items.map((x) => x[2])).filter((p) => p >= 6000));
  return (
    <a ref={ref} href={`./carta.html#grp-${g.id}`} target="_blank" rel="noopener" className={`world w${i}`} style={{ '--k': i }}>
      <div className="wd-photo"><Img id={COVER[g.id]} alt={pick(g.n)} w={700} className="h-full w-full" /><span className="glare" /></div>
      <div className="wd-body">
        <h3>{pick(g.n)}</h3>
        <p>{t.menu.blurb[g.id]}</p>
        <span className="wd-meta">{items} {t.menu.items} · {t.menu.from} {fmt.format(min)}</span>
      </div>
    </a>
  );
}

export default function Menu() {
  const { t } = useI18n();
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section id="carta" className="menu-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="text-center">
          <p className="kicker justify-center">{t.menu.eyebrow}</p>
          <h2 className="rv mask-up sec-title"><span>{t.menu.title}</span></h2>
          <p className="rv mx-auto mt-4 max-w-[52ch] text-[17px] text-choco/75">{t.menu.lead}</p>
        </div>
        <div ref={ref} className={`worlds ${seen ? 'in' : ''}`}>
          {GROUPS.map((g, i) => <World key={g.id} g={g} i={i} />)}
        </div>
        <div className="mt-12 flex justify-center"><a href="./carta.html" target="_blank" rel="noopener" className="btn btn-choco">{t.menu.full} ↗</a></div>
      </div>
    </section>
  );
}
