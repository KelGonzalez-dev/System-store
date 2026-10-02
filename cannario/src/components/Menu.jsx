import { useMemo } from 'react';
import Img from './Img';
import { MENU } from '../data';
import { useI18n } from '../i18n';

const Leaf = () => <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.3" aria-hidden="true"><path d="M3 13C3 6 7 3 13 3c0 6-3 10-10 10zM3 13l6-6" /></svg>;
const Star = () => <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6z" /></svg>;

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}

// Tarjeta de plato: foto, nombre, precio, descripción y etiquetas
export function DishCard({ m, i = 0, dark = false }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <article className={`dish ${dark ? 'dish-dark' : ''}`} style={{ '--k': i }}>
      <div className="dish-photo">
        <Img id={m.img} w={640} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px" className="h-full w-full" alt={pick(m.n)} />
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <h3 className="dish-name font-display">{pick(m.n)}</h3>
        <span className="leader" aria-hidden="true" />
        <span className="dish-price">{fmt.format(m.p)}</span>
      </div>
      <p className="dish-desc">{pick(m.d)}</p>
      {(m.chef || m.veg) && (
        <p className="mt-2.5 flex flex-wrap gap-4 text-[13px]">
          {m.chef && <span className="inline-flex items-center gap-1.5 text-gold">{<Star />}{t.menu.chef}</span>}
          {m.veg && <span className="dish-veg inline-flex items-center gap-1.5"><Leaf />{t.menu.veg}</span>}
        </p>
      )}
    </article>
  );
}

const PICKS = [3, 7, 12, 18, 22, 27];

// En el inicio: una selección de favoritos y el acceso a la carta completa (en su propia pestaña)
export default function Menu() {
  const { t } = useI18n();
  const items = PICKS.map((id) => MENU.find((m) => m.id === id));
  return (
    <section id="carta" className="menu-sec relative bg-ash text-stone">
      <div className="wrap pb-[clamp(70px,9vw,120px)] pt-[clamp(80px,10vw,130px)]">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">{t.menu.chef}</p>
            <h2 className="rv mask-up sec-title mt-3 text-stone-soft"><span>{t.menu.title}</span></h2>
          </div>
          <p className="rv max-w-[42ch] text-[16px] font-light leading-relaxed text-stone/70 md:pb-2">{t.menu.picks}</p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m, i) => <DishCard key={m.id} m={m} i={i} dark />)}
        </div>

        <div className="mt-14 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-goldgrad gap-3">
            {t.menu.full}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
