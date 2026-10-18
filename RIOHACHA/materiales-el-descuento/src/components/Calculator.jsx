import { useMemo, useState } from 'react';
import { PRODUCTS, fmt, unitPrice } from '../data';
import { useQuote } from '../quote';

// Calculadora de materiales (valores aproximados de referencia)
const TYPES = [
  { id: 'piso', n: 'Enchapar piso', u: 'm²', pid: 6, per: 4.5, d: 'Bultos de pegante de 25 kg (≈4,5 m² por bulto)', extra: { pid: 40, f: 1.1, d: 'Cerámica con 10% de desperdicio' } },
  { id: 'pared', n: 'Enchapar pared', u: 'm²', pid: 6, per: 5, d: 'Bultos de pegante de 25 kg (≈5 m² por bulto)', extra: { pid: 42, f: 1.1, d: 'Cerámica de pared con 10% de desperdicio' } },
  { id: 'pintura', n: 'Pintar paredes', u: 'm²', pid: 34, per: 12.5, d: 'Galones de vinilo a 2 manos (≈25 m² por galón por mano)' },
  { id: 'placa', n: 'Concreto (placa/piso)', u: 'm³', pid: 1, per: 1 / 7, d: 'Bultos de cemento de 50 kg (≈7 bultos por m³, mezcla 1:2:3)', extra: { pid: 21, f: 0.55, d: 'Arena lavada (≈0,55 m³ por m³)' } },
  { id: 'muro', n: 'Levantar muro', u: 'm²', pid: 18, per: 1 / 12.5, d: 'Bloques N.º 4 (≈12,5 por m²)', extra: { pid: 10, f: 0.1, d: 'Mortero de pega (≈1 bulto por 10 m²)' } },
];

export default function Calculator() {
  const { add, setOpen } = useQuote();
  const [t, setT] = useState(TYPES[0]);
  const [area, setArea] = useState(20);
  const res = useMemo(() => {
    const p = PRODUCTS.find((x) => x.id === t.pid);
    const q = Math.max(1, Math.ceil(area / t.per));
    const out = [{ p, q, d: t.d }];
    if (t.extra) { const e = PRODUCTS.find((x) => x.id === t.extra.pid); out.push({ p: e, q: Math.max(1, Math.ceil(area * t.extra.f)), d: t.extra.d }); }
    return out;
  }, [t, area]);
  const total = res.reduce((n, r) => n + unitPrice(r.p, r.q) * r.q, 0);
  return (
    <section id="calculadora" className="sec calc-sec">
      <div className="wrap calc-grid">
        <div>
          <p className="kicker">Calculadora de materiales</p>
          <h2 className="sec-title">¿Cuánto material necesitas?</h2>
          <p className="sec-lead mt-3">Elige el trabajo, escribe la medida y te decimos cuánto comprar. Con un clic lo pasas a tu cotización.</p>
          <div className="calc-types">{TYPES.map((x) => <button key={x.id} type="button" className={t.id === x.id ? 'on' : ''} onClick={() => setT(x)}>{x.n}</button>)}</div>
          <label className="calc-input">
            <span>Medida</span>
            <input type="number" min="1" value={area} onChange={(e) => setArea(Math.max(1, +e.target.value || 1))} />
            <em>{t.u}</em>
          </label>
          <input type="range" min="1" max={t.u === 'm³' ? 30 : 300} value={Math.min(area, t.u === 'm³' ? 30 : 300)} onChange={(e) => setArea(+e.target.value)} className="calc-range" aria-label="Medida" />
        </div>
        <div className="calc-result">
          <p className="cr-k">Necesitas aproximadamente</p>
          {res.map((r) => (
            <div key={r.p.id} className="cr-row">
              <b>{r.q}</b>
              <div><span>{r.p.unit}{r.q > 1 && !/m/.test(r.p.unit) ? 's' : ''} · {r.p.n}</span><small>{r.d}</small></div>
              <em>{fmt.format(unitPrice(r.p, r.q) * r.q)}{r.q >= r.p.min && <small>por mayor</small>}</em>
            </div>
          ))}
          <div className="cr-total"><span>Total aproximado</span><b>{fmt.format(total)}</b></div>
          <button type="button" className="btn btn-red w-full" onClick={() => { res.forEach((r) => add(r.p.id, r.q)); setOpen(true); }}>Agregar todo a mi cotización</button>
          <p className="cr-note">Cálculo de referencia. El consumo real depende del material, la superficie y el maestro de obra: confírmalo con un asesor.</p>
        </div>
      </div>
    </section>
  );
}
