import Marco from './Marco';
import { FOTOS } from '../data';

const CERVEZAS = [['Rubia', 'Lager'], ['Roja', 'Red Ale'], ['Negra', 'Stout'], ['IPA', 'India Pale Ale']];
/** Beer House: fotos de la barra y las cervezas de barril. */
export default function Bar() {
  return (
    <section className="bar">
      <div className="wrap bar__grid">
        <div className="bar__texto rv">
          <p className="sobre">Beer House</p>
          <h2 className="titulo">La barra, <em>siempre abierta a una buena charla.</em></h2>
          <span className="filete" />
          <p>Cerveza de barril bien fría, whisky escocés y los cócteles clásicos de siempre, preparados sin prisa.</p>
          <ul className="bar__lista">{CERVEZAS.map(([n, e]) => <li key={n}><b>{n}</b><span>{e}</span></li>)}</ul>
        </div>
        <div className="bar__fotos rv">
          <Marco src={FOTOS.margarita} alt="Margarita" pie="Margarita de la casa" />
          <Marco src={FOTOS.whisky} alt="Whisky con soda" pie="Whisky escocés" />
        </div>
      </div>
    </section>
  );
}
