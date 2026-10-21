import { memo, useState } from 'react';
import { srcSet, thumb, toMediaUrl } from '../config';

/**
 * Imagen optimizada de la API: miniatura WebP con srcSet, carga diferida, decodificación asíncrona
 * y un fondo suave mientras llega. Si el servidor aún no tiene el optimizador, usa la foto original.
 */
function Img({ src, alt = '', w = 640, widths, sizes = '(max-width: 700px) 50vw, 25vw', eager = false, className = '', onLoad }) {
  const [state, setState] = useState('load');
  const [fallback, setFallback] = useState(false);
  if (!src) return <span className={`img img--empty ${className}`} aria-hidden="true" />;
  const url = fallback ? toMediaUrl(src) : thumb(src, w);
  return (
    <span className={`img ${className}`} data-s={state}>
      <img
        src={url}
        srcSet={fallback ? undefined : srcSet(src, widths)}
        sizes={fallback ? undefined : sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : 'auto'}
        decoding="async"
        draggable="false"
        onLoad={(e) => { setState('ok'); onLoad?.(e); }}
        onError={() => { if (!fallback) setFallback(true); else setState('err'); }}
      />
    </span>
  );
}

export default memo(Img);
