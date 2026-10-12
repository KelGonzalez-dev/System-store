import { useState } from 'react';
import { U } from '../data';

// Foto con carga suave; si falla, queda un degradado elegante con el ícono de la marca
export default function Photo({ src, w = 900, alt = '', className = '', eager = false }) {
  const [st, setSt] = useState('load');
  return (
    <div className={`photo ${className}`} data-state={st}>
      {st !== 'error' && <img src={U(src, w)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" onLoad={() => setSt('ok')} onError={() => setSt('error')} />}
      {st === 'error' && <span className="photo-fb" aria-hidden="true">⚜</span>}
    </div>
  );
}
