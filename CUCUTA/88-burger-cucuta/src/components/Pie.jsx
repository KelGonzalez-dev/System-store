import { Sello, WaIcon } from './Logo';
import { CONFIG, waLink } from '../data';
import { scrollToTarget } from '../lib/scroll';

export default function Pie() {
  return (
    <footer className="pie">
      <div className="pie__cinta" aria-hidden="true"><div>{Array.from({ length: 2 }, (_, k) => <span key={k}>NO ES UNA HAMBURGUESA MÁS ✦ SABORES PREMIUM ✦ 88 BURGER ✦ CÚCUTA ✦ DOMICILIOS ✦&nbsp;</span>)}</div></div>
      <div className="wrap pie__fila">
        <Sello className="pie__sello" />
        <div>
          <p className="pie__t">88 Burger · Sabores Premium</p>
          <p className="pie__s">{CONFIG.ciudad} · Servicio a domicilio · 4:00 p. m. a 1:00 a. m.</p>
          <div className="pie__links">
            <a href={waLink('¡Hola 88 Burger!')} target="_blank" rel="noopener noreferrer"><WaIcon size={16} /> WhatsApp</a>
            <a href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Instagram @{CONFIG.instagram}</a>
            <a href="#menu" onClick={(e) => { e.preventDefault(); scrollToTarget('#menu'); }}>Menú</a>
          </div>
        </div>
      </div>
      <p className="pie__c">© {new Date().getFullYear()} 88 Burger · Cúcuta</p>
    </footer>
  );
}
