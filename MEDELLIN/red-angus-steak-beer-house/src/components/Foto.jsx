import { useState } from 'react';
import Art from './Art';
import { U } from '../data';

/** Foto con respaldo: si no carga, muestra una ilustración (nunca queda un hueco). */
export default function Foto({ id, arte = 'steak', alt = '', w = 900, className = '', eager = false }) {
  const [s, setS] = useState(id ? 'cargando' : 'error');
  return (
    <span className={`foto ${className}`} data-s={s}>
      {s !== 'error' && <img src={U(id, w)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" onLoad={() => setS('ok')} onError={() => setS('error')} />}
      {s !== 'ok' && <span className="foto__arte"><Art tipo={arte} /></span>}
    </span>
  );
}
