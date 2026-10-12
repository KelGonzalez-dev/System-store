import { useState } from 'react';
import Art from './Art';
import { U } from '../data';

// Foto real del producto; si no carga, muestra la ilustración del envase (nunca queda un hueco)
export default function Photo({ id, art, label = '', w = 700, className = '', eager = false, alt = '' }) {
  const [st, setSt] = useState(id ? 'load' : 'error');
  return (
    <div className={`photo ${className}`} data-state={st}>
      {st !== 'error' && (
        <img src={U(id, w)} srcSet={`${U(id, Math.round(w * 0.6))} ${Math.round(w * 0.6)}w, ${U(id, w)} ${w}w`} sizes="(max-width: 760px) 50vw, 25vw"
          alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onLoad={() => setSt('ok')} onError={() => setSt('error')} draggable="false" />
      )}
      {st !== 'ok' && art && <div className="photo-art"><Art art={art} label={label} /></div>}
    </div>
  );
}
