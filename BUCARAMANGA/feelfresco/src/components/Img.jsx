import { useState } from 'react';
import { U } from '../data';
import { Badge } from './Mascot';

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
        <div className="grid h-full w-full place-items-center bg-[#FFD3EC]"><Badge notes={false} className="w-2/5 max-w-[120px] opacity-90" /></div>
      )}
    </div>
  );
}
