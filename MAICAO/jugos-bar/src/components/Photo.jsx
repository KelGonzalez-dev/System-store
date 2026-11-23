import { useState } from 'react';
import { photo } from '../data/content';

export default function Photo({ k, w = 900, alt = '', className = '', pos = '50% 50%', eager = false }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div className={`${className} bg-gradient-to-br from-brand-deep via-leaf to-ink`} role="img" aria-label={alt} />;
  return (
    <img
      src={photo(k, w)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      onError={() => setBad(true)}
      className={`${className} object-cover`}
      style={{ objectPosition: pos }}
    />
  );
}
