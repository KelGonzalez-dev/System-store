import Marco from './Marco';
import { CONFIG, FOTOS } from '../data';

/** Nuestra casa: historia, dos fotos enmarcadas y una cita. */
export default function Casa() {
  return (
    <section id="casa" className="casa">
      <div className="wrap casa__grid">
        <div className="casa__fotos rv">
          <Marco src={FOTOS.comedor} alt="Comedor de Red Angus" pie="El comedor" className="casa__f1" />
          <Marco src={FOTOS.terraza} alt="Sede campestre en Chía" pie="Sede campestre · Chía" className="casa__f2" />
        </div>
        <div className="casa__texto rv">
          <p className="sobre">Nuestra casa</p>
          <h2 className="titulo">Desde {CONFIG.desde}, <em>alrededor del fuego.</em></h2>
          <span className="filete" />
          <p>Red Angus nació con una idea sencilla: servir el mejor corte de carne en una casa donde todos se sientan bienvenidos. Madera, buena música, cerveza bien fría y una parrilla que no se apaga.</p>
          <p>Hoy somos el steakhouse de muchas familias en Bogotá, y abrimos nuestra sede campestre en Chía para disfrutar de un buen almuerzo al aire libre.</p>
          <blockquote>“Un buen corte no se apura.”</blockquote>
          <ul className="casa__datos">
            <li><b>{CONFIG.desde}</b><span>Año de fundación</span></li>
            <li><b>2</b><span>Sedes: Bogotá y Chía</span></li>
            <li><b>100 %</b><span>Carne Angus</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
