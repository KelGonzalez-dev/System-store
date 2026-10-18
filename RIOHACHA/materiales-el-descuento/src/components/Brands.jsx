import { BRANDS } from '../data';

// Marcas que se consiguen en el local (cinta continua)
export default function Brands() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <div className="brands" aria-label={`Marcas: ${BRANDS.join(', ')}`}>
      <span className="br-label">Marcas que manejamos</span>
      <div className="br-mask"><div className="br-track" aria-hidden="true">{items.map((b, i) => <span key={i}>{b}</span>)}</div></div>
    </div>
  );
}
