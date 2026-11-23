import { useEffect, useState } from 'react';
import { SIZES, cop, priceFor, waLink } from '../data/content';
import { Icon, WhatsAppIcon } from './Icons';
import ProductArt from './ProductArt';

const ROWS = [['top', 'Salida'], ['heart', 'Corazón'], ['base', 'Fondo']];

export default function ProductModal({ p, onClose }) {
  const [si, setSi] = useState(2);

  useEffect(() => {
    const key = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  const size = SIZES[si];
  const price = priceFor(p, size);
  const msg = `Hola Rodriguez Perfumería, me interesa *${p.name}* (${size.l}) - ${cop(price)}. ¿Está disponible?`;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/85 md:items-center md:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div onClick={(e) => e.stopPropagation()} className="fade-up hairline relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] border bg-noir md:grid-cols-2 md:rounded-[2rem]">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="hairline absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border bg-ink/70 text-ivory transition-colors hover:border-gold hover:text-gold">
          <Icon name="close" className="h-5 w-5" />
        </button>

        <div className="relative grid min-h-[16rem] place-items-center overflow-hidden p-8 md:min-h-[32rem]" style={{ background: `radial-gradient(circle at 50% 55%, ${p.glow}40, transparent 68%)` }}>
          <div className="bottle-in h-[15rem] md:h-[24rem]"><ProductArt p={p} className="h-full w-auto" /></div>
        </div>

        <div className="p-7 sm:p-9">
          {p.tag && <span className="hairline mb-4 inline-block rounded-full border px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[.28em] text-gold">{p.tag}</span>}
          <h3 className="h-display text-5xl sm:text-6xl">{p.name}</h3>
          <p className="mt-2 font-display text-xl text-gold">{p.family}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ivory/65">{p.desc}</p>

          <dl className="mt-6 space-y-3">
            {ROWS.map(([k, label]) => (
              <div key={k} className="flex items-baseline gap-4">
                <dt className="w-16 shrink-0 font-body text-[10px] font-medium uppercase tracking-[.26em] text-ivory/40">{label}</dt>
                <dd className="flex flex-wrap gap-2">
                  {p.notes[k].map((n) => <span key={n} className="hairline rounded-full border px-3 py-1 text-[12px] text-ivory/80">{n}</span>)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Tamaño">
            {SIZES.map((s, i) => (
              <button key={s.l} type="button" onClick={() => setSi(i)} aria-pressed={si === i} className={`rounded-full border px-4 py-2 font-body text-[11px] font-medium uppercase tracking-[.16em] transition-colors ${si === i ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/70 hover:border-gold'}`}>
                {s.l}
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="gold-text font-display text-5xl font-light tabular-nums">{cop(price)}</p>
            <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-4 w-4" />Pedir ahora</a>
          </div>
        </div>
      </div>
    </div>
  );
}
