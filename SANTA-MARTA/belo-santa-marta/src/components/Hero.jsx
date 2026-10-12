import { useRef } from 'react';
import { Deco } from './Brand';
import { WaIcon } from './Nav';
import { L } from '../data';
import { useI18n, wa } from '../i18n';
import { clamp, scrollToTarget, useScrollFrame } from '../lib/scroll';

export default function Hero() {
  const { t } = useI18n();
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', clamp((p - 0.5) / 0.5).toFixed(3)); });
  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero-media" aria-hidden="true">
        <img src={L.banner} alt="" fetchpriority="high" />
        <div className="hero-shade" />
      </div>
      <div className="hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="wrap hero-inner">
        <p className="eyebrow intro" style={{ '--d': '0.2s' }}><Deco />{t.hero.eyebrow}</p>
        <h1 className="hero-belo" aria-label="BELO">
          {'BELO'.split('').map((c, i) => <span key={i} className="hb-l" style={{ '--i': i }} aria-hidden="true">{c}</span>)}
        </h1>
        <p className="hero-sub intro" style={{ '--d': '0.95s' }}><span className="gold">{t.hero.sub1}</span><em> — {t.hero.sub2}</em></p>
        <p className="hero-lead intro" style={{ '--d': '1.1s' }}>{t.hero.lead}</p>
        <div className="intro mt-9 flex flex-wrap justify-center gap-3" style={{ '--d': '1.25s' }}>
          <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WaIcon />{t.hero.c1}</a>
          <a href="#platos" onClick={(e) => { e.preventDefault(); scrollToTarget('#platos'); }} className="btn btn-line">{t.hero.c2}</a>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true"><span>{t.hero.scroll}</span><i /></div>
    </section>
  );
}
