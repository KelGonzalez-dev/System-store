import Marco from './Marco';
import { CONFIG, FOTOS } from '../data';
import { scrollToTarget } from '../lib/scroll';

export default function Portada() {
  return (
    <section id="inicio" className="portada">
      <div className="wrap portada__grid">
        <div className="portada__texto aparece">
          <p className="sobre">Steakhouse · Beer House · Desde {CONFIG.desde}</p>
          <h1>Tradición <em>en cada corte.</em></h1>
          <span className="filete" />
          <p className="portada__p">Cortes Angus seleccionados, asados al carbón con la paciencia de siempre. Una mesa para celebrar, conversar y volver.</p>
          <div className="portada__cta">
            <button type="button" className="btn btn--rojo" onClick={() => scrollToTarget('#reservas')}>Reservar mesa</button>
            <button type="button" className="btn btn--borde" onClick={() => scrollToTarget('#carta')}>Ver la carta</button>
          </div>
        </div>
        <Marco src={FOTOS.newyork} alt="Corte New York al carbón" pie="New York al carbón · nuestro corte insignia" className="portada__foto aparece" eager />
      </div>
    </section>
  );
}
