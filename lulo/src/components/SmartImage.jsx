import { useState } from 'react';

export default function SmartImage({ src, alt = '', className = '', imgClassName = '', eager = false }) {
  const list = Array.isArray(src) ? src : [src];
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const url = list[i];
  const pos = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative';

  return (
    <div className={`${pos} wood-bg overflow-hidden ${className}`}>
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  );
}
