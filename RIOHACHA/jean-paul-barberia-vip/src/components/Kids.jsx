import { L } from '../data';

// "Cariño para pequeños": sección dedicada a los niños, cálida pero elegante
export default function Kids({ onPick }) {
  return (
    <section className="kids-sec">
      <div className="wrap kids-grid py-[clamp(90px,11vw,140px)]">
        <div className="kids-photo rv">
          <img src={L.ninos} alt="Corte para niños en Jean Paul" loading="lazy" />
          <span className="kp-sticker">¡Primer corte, gran momento!</span>
        </div>
        <div>
          <p className="eyebrow"><span className="dot" /> Pequeños VIP</p>
          <h2 className="rv mask-up sec-title"><span>Cariño para <em>pequeños</em></span></h2>
          <p className="rv sec-lead mt-4">Los más pequeños también merecen su experiencia VIP. Los atendemos con paciencia, buena energía y cortes de moda para que salgan felices… y los papás también.</p>
          <ul className="kids-list">
            <li><span>🧸</span><div><b>Con paciencia</b><p>Sin afanes: a su ritmo y a su gusto.</p></div></li>
            <li><span>✂️</span><div><b>Cortes de moda</b><p>Los mismos estilos que piden los grandes.</p></div></li>
            <li><span>📸</span><div><b>Para la foto</b><p>Salen listos para el colegio, el cumpleaños o el evento.</p></div></li>
          </ul>
          <button type="button" className="btn btn-gold mt-8" onClick={() => onPick('ninos')}>Agendar corte para mi pequeño</button>
        </div>
      </div>
    </section>
  );
}
