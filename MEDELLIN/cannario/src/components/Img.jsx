import { useState } from 'react';
import { U } from '../data';
import Logo from './Logo';

// Imagen con carga diferida, srcset responsivo y respaldo elegante si la foto no carga
export default function Img({ id, alt = '', w = 900, className = '', imgClass = '', style, eager = false, sizes = '(max-width: 768px) 92vw, 45vw' }) {
  const [state, setState] = useState('load');
  const local = id.startsWith('/') || id.startsWith('http');
  const srcSet = local ? undefined : [Math.round(w * 0.5), w, Math.round(w * 1.6)].map((x) => `${U(id, x)} ${x}w`).join(', ');
  return (
    <div className={`img-frame relative overflow-hidden ${className}`} style={style} data-state={state}>
      {state !== 'error' ? (
        <img
          src={U(id, w)} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt}
          loading={eager ? 'eager' : 'lazy'} decoding="async" fetchpriority={eager ? 'high' : undefined}
          onLoad={() => setState('ok')} onError={() => setState('error')}
          className={`h-full w-full object-cover ${imgClass}`}
        />
      ) : (
        <div className={`grid h-full w-full place-items-center bg-ash ${imgClass}`}><Logo className="w-1/4 max-w-[90px] opacity-70" /></div>
      )}
    </div>
  );
}
