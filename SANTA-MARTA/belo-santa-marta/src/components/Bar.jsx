import Img from './Img';
import { Deco } from './Brand';
import { useMoney } from './Dishes';
import { BOTTLE_IDS, COCKTAIL_IDS, L, MENU } from '../data';
import { useI18n } from '../i18n';

const byId = (id) => MENU.find((m) => m.id === id);

export default function Bar() {
  const { t, pick } = useI18n();
  const fmt = useMoney();
  return (
    <section className="bar-sec">
      <div className="wrap grid items-center gap-14 py-[clamp(80px,10vw,130px)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bar-visual">
          <div className="bv-a rv"><Img id={L.barraBelo} alt="Bar BELO" w={700} className="h-full w-full" /></div>
          <div className="bv-b rv"><Img id={L.nocheBar} alt="" w={500} className="h-full w-full" /></div>
          <span className="bv-ring" aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">{t.bar.eyebrow}</p>
          <h2 className="rv mask-up sec-title"><span>{t.bar.title}</span></h2>
          <p className="rv mt-4 max-w-[46ch] text-[16px] leading-relaxed text-crema/70">{t.bar.lead}</p>
          <ul className="cocktails">
            {COCKTAIL_IDS.map((id) => { const m = byId(id); return (
              <li key={id} className="rv">
                <div className="ck-top"><h3>{pick(m.n)}</h3><span className="dots" /><b>{fmt.format(m.price)}</b></div>
                <p>{pick(m.d)}</p>
              </li>
            ); })}
          </ul>
          <h3 className="bottles-title"><Deco />{t.bar.bottles}</h3>
          <ul className="bottles">
            {BOTTLE_IDS.map((id) => { const m = byId(id); return (
              <li key={id} className="rv"><span>{pick(m.n)}</span><b>{fmt.format(m.price)}</b></li>
            ); })}
          </ul>
        </div>
      </div>
    </section>
  );
}
