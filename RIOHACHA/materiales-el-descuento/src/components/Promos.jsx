import { useEffect, useState } from 'react';
import Art from './Art';
import { PRODUCTS, PROMOS, fmt, waLink } from '../data';
import { useQuote } from '../quote';

function left(until) {
  const ms = new Date(`${until}T23:59:59-05:00`) - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return { d, h, m };
}

// Promociones con cuenta regresiva hasta la fecha de vigencia
export default function Promos() {
  const { add } = useQuote();
  const [, tick] = useState(0);
  useEffect(() => { const id = setInterval(() => tick((x) => x + 1), 30000); return () => clearInterval(id); }, []);
  const live = PROMOS.filter((p) => left(p.until));
  if (!live.length) return null;
  return (
    <section id="promociones" className="sec promos-sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker kicker-light">Promociones</p><h2 className="sec-title light">Ofertas que rinden en tu obra</h2></div>
          <p className="sec-lead light">Válidas hasta agotar existencias o hasta la fecha indicada.</p>
        </div>
        <div className="promo-grid">
          {live.map((pr, i) => {
            const t = left(pr.until);
            const prod = pr.pid ? PRODUCTS.find((p) => p.id === pr.pid) : null;
            const art = prod?.art || (pr.items ? PRODUCTS.find((p) => p.id === pr.items[0][0]).art : { k: 'martillo', c: '#e65100' });
            const off = pr.old ? Math.round((1 - pr.price / pr.old) * 100) : null;
            return (
              <article key={pr.id} className={`promo ${i === 0 ? 'big' : ''}`} style={{ '--pc': pr.color }}>
                <div className="pr-top"><span className="pr-tag">{pr.tag}</span>{off > 0 && <span className="pr-off">-{off}%</span>}</div>
                <div className="pr-art"><Art art={art} />{pr.items && <span className="pr-plus"><Art art={PRODUCTS.find((p) => p.id === pr.items[1][0]).art} /></span>}</div>
                <h3>{pr.t}</h3>
                <p>{pr.d}</p>
                {pr.price && <div className="pr-price">{pr.old && <s>{fmt.format(pr.old)}</s>}<b>{fmt.format(pr.price)}</b>{prod && <small>/ {prod.unit}</small>}</div>}
                <div className="pr-timer" aria-label={`Termina en ${t.d} días`}>
                  <span>Termina en</span>
                  <div><b>{t.d}</b><small>días</small></div><div><b>{t.h}</b><small>horas</small></div><div><b>{t.m}</b><small>min</small></div>
                </div>
                <div className="pr-actions">
                  {pr.pid && <button type="button" className="btn btn-red" onClick={() => add(pr.pid, prod.min > 10 ? 10 : 1)}>Agregar a cotización</button>}
                  {pr.items && <button type="button" className="btn btn-red" onClick={() => pr.items.forEach(([id, q]) => add(id, q))}>Agregar combo</button>}
                  <a className="btn btn-ghost" href={waLink(`¡Hola! Me interesa la promoción: ${pr.t}.`)} target="_blank" rel="noopener noreferrer">Preguntar</a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="demo-note light">⚠️ Promociones de ejemplo: el administrador las cambia en <code>src/data.js</code>.</p>
      </div>
    </section>
  );
}
