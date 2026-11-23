// Ilustraciones de línea al estilo del cupido de su logo (para cartas de lotería, carteles y respaldo de fotos).
const T = { stroke: 'currentColor', strokeWidth: 5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
export default function Dibujo({ tipo = 'corazon', className = '', relleno = 'var(--rosa)' }) {
  const d = {
    corazon: (<g><path d="M100 168C52 132 30 104 36 74c6-30 46-40 64-10 18-30 58-20 64 10 6 30-16 58-64 94z" fill={relleno} /><path {...T} d="M100 168C52 132 30 104 36 74c6-30 46-40 64-10 18-30 58-20 64 10 6 30-16 58-64 94z" /><path {...T} d="M30 150l140-100M154 50l16 0 0 16M44 140l-10 4 4-10" /><path {...T} strokeWidth="3" d="M60 80c4-10 12-14 20-12" /></g>),
    bota: (<g><path d="M70 30h50l6 90c20 4 44 12 44 30v14H62l-6-20z" fill={relleno} /><path {...T} d="M70 30h50l6 90c20 4 44 12 44 30v14H62l-6-20zM66 30l-4-8h66l-4 8M80 60c10 6 20 6 30 0M84 80c8 6 16 6 24 0" /><path {...T} d="M58 164h112" /><circle cx="44" cy="146" r="10" {...T} /></g>),
    estrella: (<g><path d="M100 24l20 50 54 4-42 34 14 52-46-30-46 30 14-52-42-34 54-4z" fill={relleno} /><path {...T} d="M100 24l20 50 54 4-42 34 14 52-46-30-46 30 14-52-42-34 54-4z" /><path {...T} strokeWidth="3" d="M30 30l8 8M170 30l-8 8M100 186v-10" /></g>),
    sombrero: (<g><path d="M70 100c0-40 10-60 30-60s30 20 30 60z" fill={relleno} /><path {...T} d="M70 100c0-40 10-60 30-60s30 20 30 60M24 104c20 20 132 20 152 0-10 30-40 44-76 44s-66-14-76-44zM70 90h60" /><path {...T} strokeWidth="3" d="M92 40c4 8 12 8 16 0" /></g>),
    novia: (<g><path d="M100 34c-26 0-40 30-46 70-6 40-14 64-24 76h140c-10-12-18-36-24-76-6-40-20-70-46-70z" fill="#FFF3EA" /><path {...T} d="M100 34c-26 0-40 30-46 70-6 40-14 64-24 76h140c-10-12-18-36-24-76-6-40-20-70-46-70z" /><path d="M78 104h44l22 76H56z" fill={relleno} /><path {...T} d="M78 104h44l22 76H56zM80 104c6-14 34-14 40 0" /><circle cx="100" cy="66" r="15" fill="#FFF3EA" {...T} /><circle cx="100" cy="130" r="10" fill="var(--coral)" /><path {...T} strokeWidth="3" d="M92 138l-6 14M108 138l6 14" /></g>),
    coctel: (<g><path d="M44 50h112l-56 62z" fill={relleno} /><path {...T} d="M44 50h112l-56 62zM100 112v54M70 168h60" /><circle cx="146" cy="50" r="14" {...T} /><path {...T} d="M120 22l-16 34" /></g>),
    margarita: (<g><path d="M40 56c0 30 26 46 60 46s60-16 60-46z" fill={relleno} /><path {...T} d="M40 56c0 30 26 46 60 46s60-16 60-46zM40 56h120M100 102v62M70 168h60" /><path {...T} d="M150 40a16 16 0 1 1 0 32" /></g>),
    cerveza: (<g><path d="M60 50h70l-6 120H66z" fill={relleno} /><path {...T} d="M60 50h70l-6 120H66zM130 76h16c10 0 14 8 14 16v22c0 8-4 16-14 16h-18M56 50c0-14 16-16 22-8 6-14 26-12 28 0 8-10 26-6 24 8" /></g>),
    shot: (<g><path d="M66 70h68l-10 90H76z" fill={relleno} /><path {...T} d="M66 70h68l-10 90H76zM72 100h56" /><path {...T} d="M140 40a20 20 0 1 1 0 40 20 20 0 0 1 0-40zM140 40v40M120 60h40" /></g>),
  }[tipo];
  return <svg viewBox="0 0 200 200" className={`dibujo ${className}`} aria-hidden="true">{d}</svg>;
}
