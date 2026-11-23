import { Letrero } from './Logo';
import { CONFIG, SEDES } from '../data';

export default function Pie() {
  return (
    <footer className="pie">
      <div className="wrap pie__grid">
        <div className="pie__logo"><Letrero /></div>
        <div><h4>Sedes</h4>{SEDES.map((s) => <p key={s.id}>{s.nombre} · {s.tipo}</p>)}</div>
        <div><h4>Contacto</h4><p><a href={CONFIG.reservas} target="_blank" rel="noopener noreferrer">Reservas en línea</a></p><p><a href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Instagram @{CONFIG.instagram}</a></p></div>
      </div>
      <p className="pie__c">© {new Date().getFullYear()} Red Angus Steak & Beer House · Desde {CONFIG.desde} · Prohibida la venta de bebidas alcohólicas a menores de edad.</p>
    </footer>
  );
}
