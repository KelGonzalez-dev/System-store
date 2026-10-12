import { useState } from 'react';
import { U } from '../data';

// Imagen con carga diferida y respaldo: si la foto no carga, muestra un fondo con el logo
export default function Img({ id, alt = '', w = 800, className = '', eager = false, sizes = '(max-width: 768px) 90vw, 40vw' }) {
  const [st, setSt] = useState('load');
  const local = id.startsWith('/') || id.startsWith('http');
  const srcSet = local ? undefined : [Math.round(w * 0.5), w, Math.round(w * 1.5)].map((x) => `${U(id, x)} ${x}w`).join(', ');
  return (
    <div className={`img-frame ${className}`} data-state={st}>
      {st !== 'error' ? (
        <img src={U(id, w)} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
          onLoad={() => setSt('ok')} onError={() => setSt('error')} draggable="false" />
      ) : (
        <div className="img-fallback"><img src="/images/local/logo-blanco.jpg" alt="" /></div>
      )}
    </div>
  );
}
