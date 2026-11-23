import Dibujo from './Dibujo';
import { CONFIG, TRAGOS, fmt } from '../data';

/** La carta de tragos como carteles de "SE BUSCA" del viejo oeste (con recompensa = precio). */
export default function Tragos() {
  return (
    <section id="tragos" className="tragos">
      <div className="wrap">
        <div className="sec-head rv">
          <p className="eyebrow">La barra</p>
          <h2 className="titulo">Se buscan <em>vivos o bebidos.</em></h2>
          <p className="sec-lead">Coctelería de autor con alma de cantina: tequila, mezcal y despecho servidos con sombrero.</p>
        </div>
        <div className="carteles">
          {TRAGOS.map((t, i) => (
            <article key={t.nombre} className="cartel rv" style={{ '--i': i, '--c': t.color, '--r': `${[-2.5, 1.8, -1.2, 2.4, -1.8, 1.2][i % 6]}deg` }}>
              <span className="cartel__clavo" aria-hidden="true" />
              <span className="cartel__se">SE BUSCA</span>
              <span className="cartel__dibujo"><Dibujo tipo={t.dibujo} relleno={t.color} /></span>
              <h3>{t.nombre}</h3>
              <p>{t.txt}</p>
              <span className="cartel__recompensa">Recompensa<b>{fmt(t.precio)}</b></span>
            </article>
          ))}
        </div>
        <div className="tragos__pie rv">
          <span>Precios de referencia. La carta completa está en nuestro menú digital.</span>
          <a className="btn btn--coral" href={CONFIG.carta} target="_blank" rel="noopener noreferrer">Ver la carta completa</a>
        </div>
      </div>
    </section>
  );
}
