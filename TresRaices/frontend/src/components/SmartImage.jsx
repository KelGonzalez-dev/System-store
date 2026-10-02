import { useState } from 'react';

/* Imagen con varias opciones de respaldo. Si ninguna carga, queda el fondo verde. */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', eager = false }) {
  const list = Array.isArray(src) ? src : [src];
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const url = list[i];
  // Si el contenedor ya es absolute, no se le agrega relative (chocaban y la imagen quedaba en 0 de alto)
  const pos = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative';

  return (
    <div className={`${pos} overflow-hidden bg-gradient-to-br from-leaf via-ink to-forest ${className}`}>
      {url && (
        <img
          key={url}
          src={url}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setI((n) => n + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  );
}
