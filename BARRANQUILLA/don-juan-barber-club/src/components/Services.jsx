import { useState } from 'react';
import Photo from './Photo';
import { SERVICES, fmt } from '../data';

/**
 * Carta de servicios estilo editorial: lista con precios y una vista previa grande que cambia
 * con el servicio elegido (en celular cada servicio se despliega con su foto).
 */
export default function Services({ onBook }) {
  const [who, setWho] = useState('el');
  const [sel, setSel] = useState(0);
  const list = SERVICES[who];
  const cur = list[Math.min(sel, list.length - 1)];
  const change = (w) => { setWho(w); setSel(0); };
  return (
    <section id="servicios" className="svc-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="svc-head">
          <div>
            <p className="kicker">Carta de servicios</p>
            <h2 className="rv mask-up sec-title"><span>Para <span key={who} className="gold-text swap">{who === 'el' ? 'él' : 'ella'}</span></span></h2>
          </div>
          <div className="switch" role="tablist" aria-label="Servicios para">
            <button type="button" role="tab" aria-selected={who === 'el'} className={who === 'el' ? 'on' : ''} onClick={() => change('el')}>Él</button>
            <button type="button" role="tab" aria-selected={who === 'ella'} className={who === 'ella' ? 'on' : ''} onClick={() => change('ella')}>Ella</button>
            <i className={`sw-knob ${who}`} />
          </div>
        </div>
        <div className="svc-layout">
          <ul key={who} className="svc-list">
            {list.map((s, i) => (
              <li key={s.id} className={i === sel ? 'on' : ''} style={{ '--i': i }}>
                <button type="button" className="sl-row" onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} aria-expanded={i === sel}>
                  <span className="sl-n">0{i + 1}</span>
                  <span className="sl-name">{s.n}{s.star && <em>Favorito</em>}</span>
                  <span className="sl-dots" />
                  <span className="sl-price">{fmt.format(s.price)}</span>
                </button>
                <div className="sl-more">
                  <div className="sl-photo"><Photo src={s.img} alt={s.n} w={700} /></div>
                  <p>{s.d}</p>
                  <div className="sl-actions"><span>{s.real ? '' : 'Desde · '}{s.min} min</span><button type="button" className="btn btn-gold !h-11" onClick={() => onBook(who, s.id)}>Reservar</button></div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="svc-preview" aria-hidden="true">
            <div key={`${who}-${cur.id}`} className="sp-card">
              <Photo src={cur.img} alt="" w={1000} />
              <div className="sp-info">
                <p className="sp-k">{who === 'el' ? 'Para él' : 'Para ella'} · {cur.min} min</p>
                <h3>{cur.n}</h3>
                <p>{cur.d}</p>
                <div className="sp-foot"><b>{fmt.format(cur.price)}</b><button type="button" className="btn btn-gold" tabIndex={-1} onClick={() => onBook(who, cur.id)}>Reservar este servicio</button></div>
              </div>
            </div>
          </aside>
        </div>
        <p className="mt-8 text-[13px] text-white/40">Corte y Corte + barba según sus publicaciones; los demás precios son de referencia.</p>
      </div>
    </section>
  );
}
