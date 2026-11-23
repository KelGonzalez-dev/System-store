import { useState } from 'react';
import Dibujo from './Dibujo';
import { U } from '../data';

/** Foto con respaldo: si no carga, muestra una ilustración del saloon (nunca queda un hueco). */
export default function Foto({ id, arte = 'corazon', alt = '', w = 900, className = '', eager = false }) {
  const [s, setS] = useState(id ? 'cargando' : 'error');
  return (
    <span className={`foto ${className}`} data-s={s}>
      {s !== 'error' && <img src={U(id, w)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" onLoad={() => setS('ok')} onError={() => setS('error')} />}
      {s !== 'ok' && <span className="foto__arte"><Dibujo tipo={arte} /></span>}
    </span>
  );
}
