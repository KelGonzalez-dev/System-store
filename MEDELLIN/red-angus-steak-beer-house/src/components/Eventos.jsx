import Marco from './Marco';
import { FOTOS } from '../data';
import { scrollToTarget } from '../lib/scroll';

export default function Eventos() {
  return (
    <section id="eventos" className="eventos">
      <div className="wrap eventos__grid">
        <Marco src={FOTOS.terraza} alt="Sede campestre de Red Angus en Chía" pie="Sede campestre · Chía" className="rv" />
        <div className="rv">
          <p className="sobre">Eventos privados</p>
          <h2 className="titulo">Celebraciones <em>con buena mesa.</em></h2>
          <span className="filete" />
          <p>Cumpleaños, aniversarios, cenas de empresa y reuniones familiares. Preparamos menús especiales para grupos y reservamos el espacio que necesites, en Bogotá o en nuestra sede campestre de Chía.</p>
          <ul className="eventos__lista">
            <li>Menús por persona para grupos</li>
            <li>Espacios privados y terraza campestre</li>
            <li>Atención dedicada durante todo el evento</li>
          </ul>
          <button type="button" className="btn btn--rojo" onClick={() => scrollToTarget('#reservas')}>Solicitar información</button>
        </div>
      </div>
    </section>
  );
}
