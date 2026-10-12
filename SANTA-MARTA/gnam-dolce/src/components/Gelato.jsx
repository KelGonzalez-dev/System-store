import { useMemo, useState } from 'react';
import { useMoney } from './Menu';
import { FLAVORS, TOPPINGS, findItem } from '../data';
import { useI18n, wa } from '../i18n';

// "Arma tu copa": eliges sabores y topping; las bolas caen a la copa y te recomendamos una copa real de la carta
export default function Gelato() {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  const [sel, setSel] = useState(['tres', 'pistacho']);
  const [top, setTop] = useState('panna');
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? [...s.slice(1), id] : [...s, id]));
  const rec = useMemo(() => {
    let name = 'Cookies & gelato';
    if (top === 'nueces') name = 'Nueces';
    else if (sel.includes('pistacho')) name = 'Pistacho crocante';
    else if (sel.length) name = FLAVORS.find((f) => f.id === sel[sel.length - 1]).copa;
    if (top === 'fresas' && !sel.includes('pistacho')) name = 'Panna cotta';
    return findItem(name);
  }, [sel, top]);
  const scoops = sel.map((id) => FLAVORS.find((f) => f.id === id));
  return (
    <section id="gelato" className="gelato-sec">
      <div className="wrap gelato-grid py-[clamp(80px,10vw,130px)]">
        <div>
          <p className="kicker">{t.gelato.eyebrow}</p>
          <h2 className="rv mask-up sec-title"><span>{t.gelato.title}</span></h2>
          <p className="rv mt-4 max-w-[46ch] text-[17px] leading-relaxed text-choco/75">{t.gelato.lead}</p>
          <p className="g-label">{t.gelato.flavors}</p>
          <div className="g-chips">
            {FLAVORS.map((f) => (
              <button key={f.id} type="button" className={sel.includes(f.id) ? 'on' : ''} onClick={() => toggle(f.id)} aria-pressed={sel.includes(f.id)}>
                <i style={{ background: f.c }} />{pick(f.n)}
              </button>
            ))}
          </div>
          <p className="g-label">{t.gelato.toppings}</p>
          <div className="g-chips">
            {TOPPINGS.map((x) => <button key={x.id} type="button" className={top === x.id ? 'on' : ''} onClick={() => setTop(x.id)} aria-pressed={top === x.id}>{pick(x.n)}</button>)}
          </div>
        </div>
        <div className="copa-wrap">
          <svg viewBox="-120 -250 240 420" className="copa" aria-hidden="true">
            <ellipse cx="0" cy="160" rx="70" ry="9" className="copa-shadow" />
            <path d="M-26 150h52l-8-10h-36z M-6 140V70h12v70z" className="glass-foot" />
            <path d="M-92 -20h184c-6 64-44 96-92 96s-86-32-92-96z" className="glass" />
            {scoops.map((f, k) => (
              <g key={`${f.id}-${k}`} transform={`translate(${[-34, 34, 0][k]} ${[-30, -30, -86][k]})`}>
                <g className="g-scoop" style={{ '--c': f.c }}>
                  <circle r="46" /><circle cx="-30" cy="28" r="12" /><circle cx="0" cy="34" r="12" /><circle cx="30" cy="28" r="12" />
                  <ellipse cx="-16" cy="-18" rx="10" ry="6" className="shine" />
                </g>
              </g>
            ))}
            {top === 'panna' && <path key="panna" className="g-top" d="M-34 -150c-6-22 20-30 22-44 10 12 34 8 30 30 18 2 22 22 6 30-14 8-50 8-58-16z" fill="#fffaf0" />}
            {top === 'fresas' && <g key="fresas" className="g-top"><path d="M-6 -140c-14 0-24-14-22-30 2-14 12-22 22-22s20 8 22 22c2 16-8 30-22 30z" fill="#d7263d" /><path d="M-18 -188l12 8 12-8-6 10 8 6-14-2-14 2 8-6z" fill="#5b8c3a" /><path d="M30 -128c-10 0-16-10-14-20s8-14 14-14 12 4 14 14-4 20-14 20z" fill="#e0384d" /></g>}
            {top === 'nueces' && <g key="nueces" className="g-top" fill="#a46a35">{[[-30, -138], [-6, -150], [20, -140], [4, -128], [-18, -124]].map(([x, y]) => <ellipse key={x + y} cx={x} cy={y} rx="9" ry="6" transform={`rotate(${x} ${x} ${y})`} />)}</g>}
            {top === 'chocolate' && <path key="choco" className="g-top" d="M-60 -60c10-50 110-50 120 0 4 14-4 18-10 14s-8 22-16 22-6-18-14-18-8 30-18 30-8-26-16-26-6 14-14 14-6-20-14-20-8 10-14 6-8-12-4-22z" fill="#3b2016" />}
          </svg>
          {rec && (
            <div className="rec">
              <span>{t.gelato.pick}</span>
              <b key={rec.it[0]}>{rec.it[0]}</b>
              <p>{rec.it[1]}</p>
              <div className="rec-foot"><em>{fmt.format(rec.it[2])}</em><a href={wa(t.gelato.msg(rec.it[0]))} target="_blank" rel="noopener noreferrer" className="btn btn-choco !h-11">{t.gelato.order}</a></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
