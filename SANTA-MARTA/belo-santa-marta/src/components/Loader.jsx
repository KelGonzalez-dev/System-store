import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { exit: 4600, exitLen: 1300 };

// Silueta del Centro Histórico de Santa Marta (catedral, campanario, techos y palmas)
function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1200 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Sierra Nevada a lo lejos */}
      <path className="sk-mount" d="M0 120L70 96l60 14 90-44 70 30 60-18 80 36 40-10v66H0z M760 124l90-38 70 22 100-52 80 34 100 20v60H760z" />
      <g fill="#06070b">
        {/* techos y casas coloniales */}
        <path d="M0 170v-58h46v-8h8v8h40v18h34v-30h60v30h22v-14h50v14h30v-24h44v24h20v-6h36v6h20v-34h52v34h16v58z" />
        {/* catedral: torre, cúpula y cruz */}
        <path d="M560 170v-74h18V58l14-14 14 14v38h18V86h70v-8c0-18 14-32 32-32s32 14 32 32v8h12v84z" />
        <path d="M590 40h4v-10h4v-4h-4v-6h-4v6h-4v4h4zM708 46h3v-8h3v-3h-3v-5h-3v5h-3v3h3z" />
        <path d="M770 170v-40h40v-12h10v12h44v-26h56v26h24v-16h40v16h30v-30h50v30h24v-10h36v10h36v40z" />
        {/* palmas */}
        <path d="M232 170c2-30 4-52 0-74l6-1c4 22 3 46 0 75zM234 96c-16-8-34-6-46 4 14-4 28-2 40 4-16 2-28 10-34 22 10-10 24-16 38-18-8 8-12 20-10 30 4-12 10-22 18-28 4 10 12 18 22 22-6-8-10-18-10-28 12 4 22 12 26 24 0-14-8-26-20-32 14 0 26 4 34 14-6-14-20-22-36-22 12-6 26-6 38 0-12-10-28-12-42-6z" />
        <path d="M1032 170c3-28 5-48 2-68h6c3 20 2 42-1 68zM1036 102c-14-8-30-8-42 0 12-2 24 0 34 6-14 2-24 10-30 20 10-8 22-12 34-14-6 8-10 18-8 26 4-10 10-18 16-24 4 8 10 14 18 18-4-6-8-14-8-22 10 4 18 10 22 20 0-12-6-22-16-28 12 0 22 4 28 12-6-12-16-18-30-18 10-4 22-4 32 0-10-8-24-10-36-6z" />
      </g>
      <g className="sk-lights" fill="#ffd98c">
        <circle cx="152" cy="146" r="2.2" /><circle cx="292" cy="140" r="2.2" /><circle cx="592" cy="110" r="2.4" /><circle cx="740" cy="120" r="2.6" /><circle cx="890" cy="138" r="2.2" /><circle cx="460" cy="150" r="2" />
      </g>
    </svg>
  );
}

/**
 * Loader "Golden hour en el rooftop":
 * el sol de Santa Marta se hunde en el mar, el cielo pasa de coral a noche y salen las estrellas,
 * se encienden las luces del rooftop y la silueta del Centro Histórico; las letras BELO se trazan en oro
 * y se llenan con un brillo; el indicador art déco del ascensor sube del piso 1 al rooftop.
 * Al final la página aparece a través de la "O" de BELO, que se abre hasta cubrir la pantalla.
 */
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState('in');
  const boxRef = useRef(null);
  const oRef = useRef(null);
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
      // centro de la "O" para abrir la página a través de ella
      const r = oRef.current?.getBoundingClientRect();
      if (r && boxRef.current) {
        boxRef.current.style.setProperty('--ox', `${r.left + r.width / 2}px`);
        boxRef.current.style.setProperty('--oy', `${r.top + r.height / 2}px`);
      }
      unlock();
      onReveal();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setPhase('exit');
        timers.push(setTimeout(onDone, reduce ? 200 : T.exitLen + 150));
      }));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 700 : T.exit));
    return () => { timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div ref={boxRef} className={`belo-loader ph-${phase}`} role="status" aria-label="BELO">
      <div className="ld-sky sunset" aria-hidden="true" />
      <div className="ld-sky night" aria-hidden="true" />
      <div className="ld-stars" aria-hidden="true" />
      <div className="ld-sun" aria-hidden="true" />
      <div className="ld-sea" aria-hidden="true"><i /><i /><i /></div>
      <Skyline />
      <div className="ld-string" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="ld-center">
        <svg viewBox="0 0 300 140" className="ld-word" aria-label="BELO">
          <defs>
            <linearGradient id="goldFill" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#9c7a3c" /><stop offset=".35" stopColor="#e7cd8f" /><stop offset=".5" stopColor="#fff3cf" /><stop offset=".65" stopColor="#e7cd8f" /><stop offset="1" stopColor="#9c7a3c" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
          <text x="150" y="120" textAnchor="middle" className="lw-text">BEL<tspan ref={oRef}>O</tspan></text>
        </svg>
        <p className="ld-tag">{t.loader.tag}</p>
        <p className="ld-place">{t.loader.place}</p>
      </div>
        <div className="ld-dial" aria-hidden="true">
        <svg viewBox="0 0 120 66">
          <path d="M10 60a50 50 0 0 1 100 0" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
          {[-70, -35, 0, 35, 70].map((a, i) => (
            <g key={a} transform={`rotate(${a} 60 60)`}><line x1="60" y1="14" x2="60" y2="20" stroke="currentColor" strokeWidth="1.4" /><text x="60" y="30" textAnchor="middle" className="dial-n" transform={`rotate(${-a} 60 28)`}>{i === 4 ? 'R' : i + 1}</text></g>
          ))}
          <g className="needle"><line x1="60" y1="60" x2="60" y2="22" stroke="#e7cd8f" strokeWidth="1.6" strokeLinecap="round" /><circle cx="60" cy="60" r="3.4" fill="#e7cd8f" /></g>
        </svg>
        <span>{t.loader.up}</span>
      </div>
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
