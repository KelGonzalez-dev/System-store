// Marca propia de Zulima: monograma de hoja + nombre en cursiva
export function Monogram({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={`monogram ${className}`} aria-hidden="true">
      <circle cx="32" cy="32" r="30" className="mg-disc" />
      <path d="M18 20h26L22 44h24" className="mg-z" />
      <path d="M44 20c6-8 14-8 14-8s0 10-10 14c-3 1-5 0-4-6z" className="mg-leaf" />
      <path d="M20 44c-6 8-14 8-14 8s0-10 10-14c3-1 5 0 4 6z" className="mg-leaf l2" />
    </svg>
  );
}

export function Logo({ className = '', sub = true }) {
  return (
    <span className={`logo ${className}`}>
      <Monogram />
      <span className="logo-txt"><b>Zulima</b>{sub && <small>Consultora Natura</small>}</span>
    </span>
  );
}
