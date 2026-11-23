import Dibujo from './Dibujo';
import { AMBIENTE } from '../data';

const COSAS = [
  ['sombrero', 'Sombreros', 'Ponte el tuyo o pide uno en la barra.'],
  ['margarita', 'Tequila & mezcal', 'Coctelería de autor con alma de cantina.'],
  ['corazon', 'Despecho', 'Canciones para cantar a todo pulmón.'],
  ['estrella', 'Fiesta', 'Noches que terminan en historias.'],
];

/** El saloon: frase grande que se colorea palabra por palabra y lo que vas a encontrar. */
export default function Saloon() {
  const frase = 'Aquí se viene a cantar lo que el corazón no se atreve a decir.'.split(' ');
  return (
    <section id="saloon" className="saloon">
      <div className="wrap">
        <p className="eyebrow rv">Bienvenido al saloon</p>
        <p className="saloon__frase rv">{frase.map((w, i) => <span key={i} style={{ '--i': i }}>{w} </span>)}</p>
      </div>
      <div className="ambiente" aria-label="Fotos del saloon">
        <div className="ambiente__rollo">
          {[...AMBIENTE, ...AMBIENTE].map((f, i) => <span key={i} className="ambiente__foto" style={{ '--r': `${[-3, 2, -1.5, 3, -2.5][i % 5]}deg` }}><img src={f} alt="" loading="lazy" decoding="async" /></span>)}
        </div>
      </div>
      <div className="wrap">
        <ul className="saloon__cosas">
          {COSAS.map(([d, t, x], i) => (
            <li key={t} className="rv" style={{ transitionDelay: `${i * 0.08}s` }}>
              <Dibujo tipo={d} />
              <b>{t}</b>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
