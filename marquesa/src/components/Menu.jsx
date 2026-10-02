import { useEffect, useMemo, useRef, useState } from 'react';
import Img from './Img';
import { CAT_IMG, GROUPS, MENU, PICKS, U } from '../data';
import { sendMessage, useI18n } from '../i18n';

export const Icon = {
  star: <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M8 1l2 4.6 5 .5-3.8 3.3 1.1 4.9L8 11.8 3.7 14.3l1.1-4.9L1 6.1l5-.5z" /></svg>,
  leaf: <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.4" aria-hidden="true"><path d="M3 13C3 6 7 3 13 3c0 6-3 10-10 10zM3 13l6-6" /></svg>,
  chili: <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M11 3c1-1 2-1 3 0-1 0-1.6.5-1.8 1.2C13.6 5 14 6.4 13 8c-1.6 2.8-5.4 5.7-10 6 3-1.6 5.4-4.4 6.4-7.4.3-1 1-1.7 1.6-2z" /></svg>,
};

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}

// Tarjeta de plato con foto, nombre, precio, descripción y etiquetas
export function DishCard({ m, i = 0 }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <article className="dish" style={{ '--k': i }}>
      <div className="dish-photo">
        <Img id={m.img} w={640} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px" className="h-full w-full" alt={pick(m.n)} />
        <span className="dish-price font-display">{fmt.format(m.p)}</span>
      </div>
      <div className="dish-body">
        <h3 className="dish-name font-display">{pick(m.n)}</h3>
        <p className="dish-desc">{pick(m.d)}</p>
        {(m.chef || m.veg || m.spicy) && (
          <p className="dish-tags">
            {m.chef && <span className="tg-fav">{Icon.star}{t.menu.chef}</span>}
            {m.spicy && <span className="tg-hot">{Icon.chili}{t.menu.spicy}</span>}
            {m.veg && <span className="tg-veg">{Icon.leaf}{t.menu.veg}</span>}
          </p>
        )}
      </div>
    </article>
  );
}

// Botón "antojo fuera de carta": abre WhatsApp o Instagram con un mensaje listo
export function OffMenu() {
  const { t } = useI18n();
  const [note, setNote] = useState('');
  const ask = async () => {
    const r = await sendMessage(`Hola Marquesa 👋 ${t.menu.off.t}`);
    if (r === 'ig') { setNote(t.visit.copied); setTimeout(() => setNote(''), 6000); }
  };
  return (
    <div className="offmenu">
      <svg viewBox="0 0 64 64" className="offmenu-heart" aria-hidden="true"><path d="M32 54S8 40 8 23a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 17-24 31-24 31z" /></svg>
      <div>
        <h3 className="font-display">{t.menu.off.t}</h3>
        <p>{t.menu.off.d}</p>
        {note && <p className="mt-2 text-[13px] text-rosa">{note}</p>}
      </div>
      <button type="button" onClick={ask} className="btn btn-neon shrink-0">{t.menu.off.c}</button>
    </div>
  );
}

// Lista grande de categorías: al pasar el cursor aparece la foto siguiendo el mouse
function CategoryCloud() {
  const { t } = useI18n();
  const float = useRef(null);
  const [cat, setCat] = useState(null);
  const counts = useMemo(() => Object.fromEntries(Object.keys(CAT_IMG).map((c) => [c, MENU.filter((m) => m.cat === c).length])), []);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0;
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      float.current.style.transform = `translate3d(${x}px,${y}px,0) rotate(${(tx - x) * 0.04}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { tx = e.clientX + 24; ty = e.clientY - 120; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="cat-cloud" onMouseLeave={() => setCat(null)}>
      {Object.values(GROUPS).flat().map((c, i) => (
        <a key={c} href={`./carta.html#cat-${c}`} target="_blank" rel="noopener" className="cloud-word font-display" style={{ '--k': i }}
          onMouseEnter={() => setCat(c)}>
          {t.menu.cats[c]}<sup>{counts[c]}</sup>
        </a>
      ))}
      <div ref={float} className={`cloud-float ${cat ? 'on' : ''}`} aria-hidden="true">
        {Object.entries(CAT_IMG).map(([c, id]) => <img key={c} src={U(id, 500)} alt="" className={cat === c ? 'on' : ''} loading="lazy" />)}
      </div>
    </div>
  );
}

export default function Menu() {
  const { t } = useI18n();
  const items = PICKS.map((id) => MENU.find((m) => m.id === id));
  return (
    <section id="carta" className="menu-sec relative overflow-hidden">
      <div className="wrap relative py-[clamp(80px,10vw,140px)]">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-end">
          <h2 className="rv mask-up sec-title text-noche"><span>{t.menu.title}</span></h2>
          <p className="rv max-w-[44ch] text-[16px] font-medium leading-relaxed text-noche/75 md:justify-self-end md:pb-3">{t.menu.lead}</p>
        </div>

        <CategoryCloud />

        <div className="mt-[clamp(56px,7vw,90px)] flex items-end justify-between gap-4">
          <h3 className="font-script text-[clamp(40px,4.4vw,60px)] leading-none text-magenta">{t.menu.picks}</h3>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
        </div>

        <div className="mt-12"><OffMenu /></div>

        <div className="mt-12 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-dark gap-3">
            {t.menu.full}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
