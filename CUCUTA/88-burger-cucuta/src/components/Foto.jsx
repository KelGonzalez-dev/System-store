import { useState } from 'react';
import Art from './Art';
import { U } from '../data';

/** Foto del plato con respaldo: si no carga, muestra la ilustración del plato. */
export default function Foto({ id, arte = 'burger', alt = '', w = 800, className = '', eager = false }) {
  const [estado, setEstado] = useState(id ? 'cargando' : 'error');
  return (
    <span className={`foto ${className}`} data-s={estado}>
      {estado !== 'error' && (
        <img src={U(id, w)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false"
          onLoad={() => setEstado('ok')} onError={() => setEstado('error')} />
      )}
      {estado !== 'ok' && <span className="foto__arte"><Art tipo={arte} /></span>}
    </span>
  );
}
