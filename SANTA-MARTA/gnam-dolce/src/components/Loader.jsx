import { useEffect, useRef, useState } from 'react';
import { GnamLogo } from './Brand';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { exit: 4700, exitLen: 1500 };

// Bola de gelato con borde ondulado abajo
function Scoop({ y, r, color, cls }) {
  const bumps = [-0.72, -0.36, 0, 0.36, 0.72];
  return (
    <g className={`scoop ${cls}`} style={{ '--c': color }}>
      <circle cx="0" cy={y} r={r} />
      {bumps.map((b) => <circle key={b} cx={b * r} cy={y + r * 0.62} r={r * 0.24} />)}
      <ellipse cx={-r * 0.35} cy={y - r * 0.4} rx={r * 0.22} ry={r * 0.12} className="shine" />
    </g>
  );
}

/**
 * Loader "La copa perfecta":
 * aparece un cono de barquillo y caen tres bolas de gelato (pistacho, fresa y tres leches) que rebotan al apilarse;
 * baja un chorro de chocolate, corona una fresa y se escribe "Gnam" con su trazo original, luego DOLCE y #TULUGARDULCE.
 * Al final, dos cortinas que gotean (crema y chocolate) bajan sobre la pantalla y revelan la página.
 */
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState('in');
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setPhase('exit');
      timers.push(setTimeout(() => { unlock(); onReveal(); setPhase('reveal'); }, reduce ? 0 : 720));
      timers.push(setTimeout(onDone, reduce ? 200 : T.exitLen + 150));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 700 : T.exit));
    return () => { timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  const tag = '#TULUGARDULCE';
  return (
    <div className={`gn-loader ph-${phase}`} role="status" aria-label="Gnam Dolce">
      <div className="ld-bg" aria-hidden="true" />
      <div className="ld-center">
        <svg viewBox="-110 -235 220 390" className="sundae" aria-hidden="true">
          <defs>
            <pattern id="waffle" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="14" height="14" fill="#d9a35e" /><path d="M0 0H14M0 0V14" stroke="#b47a3a" strokeWidth="3" />
            </pattern>
          </defs>
          <ellipse cx="0" cy="148" rx="54" ry="7" className="plate-shadow" />
          <g className="cone"><path d="M-56 18L0 146 56 18Z" fill="url(#waffle)" /><path d="M-60 12h120v12h-120z" rx="6" fill="#c98d4c" /></g>
          <Scoop y={-8} r={56} color="#b7c98a" cls="s1" />
          <Scoop y={-70} r={50} color="#f2a7b4" cls="s2" />
          <Scoop y={-124} r={44} color="#f4e6c8" cls="s3" />
          <path className="drip" d="M-40 -150c10-26 70-26 80 0 6 14 2 26-4 30-6 4-8 20-14 20s-6-14-12-14-6 26-14 26-6-20-12-20-6 12-12 12-6-16-12-20c-6-4-6-20 0-34z" />
          <g className="berry"><path d="M0 -150c-14 0-24-14-22-30 2-14 12-22 22-22s20 8 22 22c2 16-8 30-22 30z" fill="#d7263d" /><path d="M-12 -198l12 8 12-8-6 10 8 6-14-2-14 2 8-6z" fill="#5b8c3a" /><g fill="#f7d36b"><circle cx="-8" cy="-178" r="1.6" /><circle cx="6" cy="-184" r="1.6" /><circle cx="8" cy="-168" r="1.6" /><circle cx="-4" cy="-162" r="1.6" /></g></g>
        </svg>
        <div className="ld-logo"><GnamLogo /></div>
        <p className="ld-tag" aria-label={tag}>{tag.split('').map((c, i) => <span key={i} style={{ '--i': i }} aria-hidden="true">{c}</span>)}</p>
        <p className="ld-making"><i aria-hidden="true" />{t.loader.making}</p>
      </div>
      <div className="curtain c1" aria-hidden="true" />
      <div className="curtain c2" aria-hidden="true" />
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
