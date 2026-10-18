import { EXPERIENCES, SERVICES, fmt } from '../data';

// Carta de precios: clara, rápida de leer y con botón para agendar cada servicio
export default function Prices({ onPick }) {
  const cats = EXPERIENCES.filter((e) => SERVICES.some((s) => s.cat === e.id));
  return (
    <section id="precios" className="price-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="text-center">
          <p className="eyebrow justify-center"><span className="dot" /> Carta de servicios</p>
          <h2 className="rv mask-up sec-title"><span>Precios <em>claros</em></span></h2>
        </div>
        <div className="menu-card rv">
          <span className="mc-corner tl" /><span className="mc-corner tr" /><span className="mc-corner bl" /><span className="mc-corner br" />
          {cats.map((c) => (
            <div key={c.id} className="mc-group">
              <h3>{c.n}</h3>
              {SERVICES.filter((s) => s.cat === c.id).map((s) => (
                <button key={s.id} type="button" className="mc-item" onClick={() => onPick(c.id, s.id)}>
                  <span className="mi-n">{s.n}{s.star && <em>Favorito</em>}<small>{s.d} · {s.min} min</small></span>
                  <span className="mi-dots" />
                  <span className="mi-p">{fmt.format(s.price)}</span>
                  <span className="mi-go" aria-hidden="true">Agendar →</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[13px] text-white/40">Precios de referencia en pesos colombianos. Confirma el valor al agendar.</p>
      </div>
    </section>
  );
}
