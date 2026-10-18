import { useState } from 'react';
import Art from './Art';
import { U } from '../data';

// Foto con respaldo: si no carga, muestra la ilustración
export default function Photo({ src, art, w = 700, alt = '', className = '' }) {
  const [st, setSt] = useState(src ? 'load' : 'error');
  return (
    <div className={`photo ${className}`} data-state={st}>
      {st !== 'error' && <img src={U(src, w)} alt={alt} loading="lazy" decoding="async" onLoad={() => setSt('ok')} onError={() => setSt('error')} />}
      {st !== 'ok' && art && <div className="photo-art"><Art art={art} /></div>}
    </div>
  );
}
