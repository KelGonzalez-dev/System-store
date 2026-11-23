import { Logo } from './Logo';
import { CONFIG } from '../data';

export default function Pie() {
  return (
    <footer className="pie">
      <div className="wrap pie__fila">
        <Logo className="pie__logo" />
        <div className="pie__info">
          <p>{CONFIG.direccion}</p>
          <div className="pie__links">
            <a href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={CONFIG.carta} target="_blank" rel="noopener noreferrer">Carta digital</a>
            <a href="#reserva">Reservas</a>
          </div>
        </div>
      </div>
      <p className="pie__c">© {new Date().getFullYear()} Canta Corazón · Saloon Sentimental · Consume con moderación. Prohibida la venta de bebidas alcohólicas a menores de edad.</p>
    </footer>
  );
}
