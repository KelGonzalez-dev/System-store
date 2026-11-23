import { CARTA, CONFIG, FOTOS, fmt } from '../data';

/** La carta completa a la vista, como una carta impresa de mantel: dos columnas y líneas de puntos. */
export default function Carta() {
  const mitad = Math.ceil(CARTA.length / 2);
  const col = (secs) => secs.map((s) => (
    <div key={s.titulo} className="carta__sec">
      <h3>{s.titulo}</h3>
      {s.nota && <p className="carta__nota">{s.nota}</p>}
      <ul>
        {s.items.map(([n, d, p]) => (
          <li key={n}>
            <div className="carta__fila"><span>{n}</span><i /><b>{fmt(p)}</b></div>
            <p>{d}</p>
          </li>
        ))}
      </ul>
    </div>
  ));
  return (
    <section id="carta" className="carta">
      <div className="wrap">
        <div className="pergamino rv">
          <div className="cabeza cabeza--oscura">
            <p className="sobre">Red Angus · Steak & Beer House</p>
            <h2 className="titulo">La carta</h2>
            <span className="filete filete--centro" />
          </div>
          <div className="carta__cols">
            <div>{col(CARTA.slice(0, mitad))}</div>
            <div>{col(CARTA.slice(mitad))}</div>
          </div>
          <div className="carta__fotos">
            {[FOTOS.provoleta, FOTOS.sandwich, FOTOS.pancakes, FOTOS.postre].map((f) => <img key={f} src={f} alt="" loading="lazy" />)}
          </div>
          <p className="carta__pie">Precios en pesos colombianos, con impuestos incluidos. Pregunta por los cortes especiales del día.</p>
        </div>
        <p className="carta__mas"><a href={CONFIG.reservas} target="_blank" rel="noopener noreferrer">Reservas y carta en línea →</a></p>
      </div>
    </section>
  );
}
