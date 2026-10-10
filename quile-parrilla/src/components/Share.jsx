import { useMemo, useState } from 'react';
import Img from './Img';
import { WaIcon } from './Nav';
import { MENU, SHARE_IDS, SIZES } from '../data';
import { useI18n, wa } from '../i18n';
import { useMoney } from './Menu';

const byId = (id) => MENU.find((m) => m.id === id);

function Person({ on }) {
  return (
    <svg viewBox="0 0 24 24" className={`person ${on ? 'on' : ''}`} aria-hidden="true">
      <circle cx="12" cy="7" r="4" /><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
    </svg>
  );
}

// "¿Cuántos son en la mesa?": recomienda el tamaño de salchipapa (de personal a tipo ballena)
function Sizer() {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  const [n, setN] = useState(4);
  const size = useMemo(() => SIZES.find((s) => n <= s.max) || SIZES[SIZES.length - 1], [n]);
  const item = byId(size.id);
  const scale = 0.55 + (SIZES.indexOf(size) / (SIZES.length - 1)) * 0.45;
  return (
    <div className="sizer">
      <div className="sizer-text">
        <h3 className="sec-title text-[clamp(30px,3.6vw,48px)]">{t.share.sizer.title}</h3>
        <p className="mt-3 max-w-[44ch] text-[15.5px] leading-relaxed text-madera/75">{t.share.sizer.lead}</p>
        <div className="sizer-people" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <Person key={i} on={i < n} />)}</div>
        <label className="sizer-range">
          <span className="sr-only">{t.share.people}</span>
          <input type="range" min="1" max="10" value={n} onChange={(e) => setN(+e.target.value)} style={{ '--p': `${((n - 1) / 9) * 100}%` }} />
          <b>{n} {t.share.people}</b>
        </label>
      </div>
      <div className="sizer-plate">
        <div className="plate" style={{ '--s': scale }}>
          <div className="plate-in"><Img id={item.img} alt={pick(item.n)} w={600} className="h-full w-full" /></div>
        </div>
        <div className="sizer-result">
          <p className="font-script text-[24px] text-fuego">{t.share.sizer.for} {item.people} {t.share.people}</p>
          <p className="sizer-name">{pick(item.n)}</p>
          <p className="sizer-price">{fmt.format(item.price)}</p>
          <a href={wa(t.menu.orderMsg(pick(item.n)))} target="_blank" rel="noopener noreferrer" className="btn btn-blue mt-4"><WaIcon />{t.share.sizer.order}</a>
        </div>
      </div>
    </div>
  );
}

export default function Share() {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <section id="compartir" className="share-sec relative overflow-hidden">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="text-center">
          <p className="eyebrow eyebrow-dark justify-center">{t.share.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3 text-madera"><span>{t.share.title}</span></h2>
          <p className="rv mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-madera/75">{t.share.lead}</p>
        </div>
        <div className="share-cards mt-12">
          {SHARE_IDS.map((id, i) => {
            const m = byId(id);
            return (
              <article key={id} className="share-card rv" style={{ '--k': i }}>
                <div className="sc-photo"><Img id={m.img} alt={pick(m.n)} w={700} className="h-full w-full" /></div>
                <span className="sc-num">0{i + 1}</span>
                <div className="sc-body">
                  <span className="sc-people">👥 {m.people}+ {t.share.people}</span>
                  <h3>{pick(m.n)}</h3>
                  <p>{pick(m.d)}</p>
                  <div className="sc-foot">
                    <b>{fmt.format(m.price)}</b>
                    <a href={wa(t.menu.orderMsg(pick(m.n)))} target="_blank" rel="noopener noreferrer" className="sc-btn">{t.share.ask} →</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <Sizer />
      </div>
    </section>
  );
}
