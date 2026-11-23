/** Foto enmarcada con filete dorado (estilo clásico). */
export default function Marco({ src, alt, pie, className = '', eager = false }) {
  return (
    <figure className={`marco ${className}`}>
      <span className="marco__img"><img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" /></span>
      {pie && <figcaption>{pie}</figcaption>}
    </figure>
  );
}
