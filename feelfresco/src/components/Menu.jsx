import { useMemo } from 'react';
import Img from './Img';
import { CAT_IMG, CATS, MENU, PICKS } from '../data';
import { useI18n } from '../i18n';

export function useMoney() {
  const { locale } = useI18n();
  return useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), [locale]);
}

// Tarjeta de plato estilo sticker (amarilla con borde y sombra retro)
export function DishCard({ m, i = 0 }) {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <article className="dish" style={{ '--k': i, '--r': `${(i % 3) - 1}deg` }}>
      <div className="dish-photo">
        <Img id={m.img} w={640} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 360px" className="h-full w-full" alt={pick(m.n)} />
        <span className="dish-price font-display">{fmt.format(m.p)}</span>
      </div>
      <div className="px-1 pb-1 pt-4">
        <h3 className="dish-name font-display">{pick(m.n)}</h3>
        <p className="dish-desc">{pick(m.d)}</p>
        {(m.fav || m.hot || m.veg) && (
          <p className="dish-tags">
            {m.fav && <span className="tg-fav">★ {t.menu.fav}</span>}
            {m.hot && <span className="tg-hot">🌶 {t.menu.hot}</span>}
            {m.veg && <span className="tg-veg">🌱 {t.menu.veg}</span>}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Menu() {
  const { t } = useI18n();
  const items = PICKS.map((id) => MENU.find((m) => m.id === id));
  return (
    <section id="menu" className="menu-sec relative overflow-hidden">
      <div className="wrap relative py-[clamp(80px,10vw,130px)]">
        <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-end">
          <h2 className="rv mask-up sec-title text-rojo"><span>{t.menu.title}</span></h2>
          <p className="rv max-w-[46ch] text-[16px] font-medium leading-relaxed text-vino/80 md:justify-self-end">{t.menu.lead}</p>
        </div>
        <div className="cat-stickers mt-10">
          {CATS.map((c, i) => (
            <a key={c} href={`./carta.html#cat-${c}`} target="_blank" rel="noopener" className="cat-sticker" style={{ '--k': i, '--r': `${[-3, 2, -1.5, 3, -2, 1.5][i]}deg` }}>
              <span className="cs-img"><Img id={CAT_IMG[c]} w={240} sizes="96px" className="h-full w-full" alt="" /></span>
              <span className="font-display">{t.menu.cats[c]}</span>
            </a>
          ))}
        </div>
        <h3 className="mt-[clamp(56px,7vw,84px)] font-script text-[clamp(40px,4.4vw,60px)] leading-none text-rojo">{t.menu.picks}</h3>
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m, i) => <DishCard key={m.id} m={m} i={i} />)}
        </div>
        <div className="mt-14 flex justify-center">
          <a href="./carta.html" target="_blank" rel="noopener" className="btn btn-red gap-3">
            {t.menu.full}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.4" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
