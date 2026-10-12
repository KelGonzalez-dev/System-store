import { useState } from 'react';
import { LOCAL, U } from '../data';

// Imagen con carga diferida, srcset responsivo y respaldo con el logo si la foto no carga
export default function Img({ id, alt = '', w = 900, className = '', imgClass = '', style, eager = false, sizes = '(max-width: 768px) 92vw, 45vw' }) {
  const [state, setState] = useState('load');
  const local = id.startsWith('/') || id.startsWith('http');
  const srcSet = local ? undefined : [Math.round(w * 0.5), w, Math.round(w * 1.6)].map((x) => `${U(id, x)} ${x}w`).join(', ');
  return (
    <div className={`img-frame relative overflow-hidden ${className}`} style={style} data-state={state}>
      {state !== 'error' ? (
        <img
          src={U(id, w)} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} draggable="false"
          loading={eager ? 'eager' : 'lazy'} decoding="async"
          onLoad={() => setState('ok')} onError={() => setState('error')}
          className={`h-full w-full object-cover ${imgClass}`}
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-noche-3"><img src={LOCAL.logo} alt="" className="w-1/3 max-w-[110px] opacity-80" /></div>
      )}
    </div>
  );
}
