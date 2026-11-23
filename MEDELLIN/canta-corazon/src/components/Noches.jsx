import { useState } from 'react';
import Dibujo from './Dibujo';
import { NOCHES } from '../data';

/**
 * Las noches de la semana como CARTAS DE LOTERÍA: se reparten en abanico al entrar en pantalla
 * y al tocarlas se voltean en 3D para mostrar el plan de esa noche.
 */
export default function Noches() {
  const [vuelta, setVuelta] = useState(null);
  return (
    <section id="noches" className="noches">
      <div className="wrap">
        <div className="sec-head rv">
          <p className="eyebrow">La lotería de la semana</p>
          <h2 className="titulo">¿Qué carta <em>te toca hoy?</em></h2>
          <p className="sec-lead">Cada noche tiene su carta. Tócala para ver qué pasa en el saloon.</p>
        </div>
        <div className="loteria">
          {NOCHES.map((n, i) => (
            <button key={n.carta} type="button" className="carta rv" data-vuelta={vuelta === i ? '1' : undefined} style={{ '--i': i, '--r': `${(i - 2) * 4}deg` }} onClick={() => setVuelta(vuelta === i ? null : i)} aria-pressed={vuelta === i} aria-label={`${n.carta}: ${n.dia}, ${n.titulo}`}>
              <span className="carta__in">
                <span className="carta__frente">
                  <span className="carta__num">{n.num}</span>
                  <span className="carta__dibujo"><Dibujo tipo={n.dibujo} /></span>
                  <span className="carta__nombre">{n.carta}</span>
                </span>
                <span className="carta__reves">
                  <span className="carta__foto" style={{ backgroundImage: `url(${n.foto})` }} />
                  <small>{n.dia}</small>
                  <b>{n.titulo}</b>
                  <span>{n.txt}</span>
                  <i>Toca para voltear</i>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
