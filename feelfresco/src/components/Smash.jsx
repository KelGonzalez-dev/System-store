import { useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { clamp, ease, lerp, useScrollFrame } from '../lib/scroll';

const seg = (p, a, b) => clamp((p - a) / (b - a));
const backOut = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

// Escena controlada por el scroll: la bola de carne se aplasta con la espátula, se dora, cae el queso y el pan
export default function Smash() {
  const { t } = useI18n();
  const sec = useRef(null);
  const r = useRef({});
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const set = (k) => (el) => { r.current[k] = el; };

  useScrollFrame(sec, (p) => {
    const R = r.current;
    if (!R.meat) return;
    // espátula: baja (0.16–0.32), presiona, sube y se va (0.38–0.5)
    const down = ease(seg(p, 0.14, 0.3));
    const up = seg(p, 0.38, 0.5);
    const dy = up > 0 ? lerp(82, -220, ease(up)) : lerp(-60, 82, down);
    R.spat.style.transform = `translate3d(0,${dy}px,0) rotate(${lerp(-6, 0, down) + up * 10}deg)`;
    R.spat.style.opacity = 1 - up;
    // aplastado de la carne (solo cuando la espátula la toca)
    const s = up > 0 ? 1 : clamp((dy - 30) / 52);
    R.meat.style.transform = `translate(210px,268px) scale(${1 + 1.3 * s},${1 - 0.68 * s})`;
    // dorado y costra
    const cook = ease(seg(p, 0.4, 0.66));
    R.cooked.style.opacity = cook;
    R.crust.style.opacity = cook;
    R.sizzle.style.opacity = s > 0.6 ? 1 : 0;
    R.steam.style.opacity = seg(p, 0.44, 0.56) * (1 - seg(p, 0.92, 1) * 0.6);
    // ¡SMASH!
    const boom = seg(p, 0.27, 0.33);
    const fade = seg(p, 0.4, 0.48);
    R.boom.style.opacity = boom * (1 - fade);
    R.boom.style.transform = `translate(210px,118px) scale(${0.4 + backOut(boom) * 0.6}) rotate(-8deg)`;
    // queso
    const drop = ease(seg(p, 0.66, 0.76));
    const melt = ease(seg(p, 0.76, 0.86));
    R.cheese.style.transform = `translate(210px,${lerp(-60, 250, drop)}px)`;
    R.cheese.style.opacity = drop > 0 ? 1 : 0;
    R.drips.style.transform = `scaleY(${melt})`;
    // pan de arriba
    const bun = seg(p, 0.86, 0.96);
    R.bun.style.transform = `translate(210px,${lerp(-120, 240, backOut(bun))}px)`;
    R.bun.style.opacity = bun > 0 ? 1 : 0;
    // paso activo
    const st = p < 0.2 ? 0 : p < 0.42 ? 1 : p < 0.68 ? 2 : 3;
    if (st !== stepRef.current) { stepRef.current = st; setStep(st); }
  }, 'pin');

  return (
    <section id="smash" ref={sec} className="relative h-[340svh] bg-crema">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid items-center gap-4 pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <div>
            <p className="eyebrow-sticker is-pink">{t.smash.eyebrow}</p>
            <h2 className="smash-title sec-title mt-3 text-rojo">{t.smash.title}</h2>
            <ol className="smash-steps mt-4">
              {t.smash.steps.map((s, i) => (
                <li key={i} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <span className="st-n font-display">{i + 1}</span>
                  <div><h3 className="font-display">{s.t}</h3><p>{s.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="smash-scene">
            <svg viewBox="0 0 420 380" className="h-full w-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="heat" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFB347" stopOpacity=".7" /><stop offset="1" stopColor="#FFB347" stopOpacity="0" /></radialGradient>
                <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F6F8" /><stop offset="1" stopColor="#AEB4BC" /></linearGradient>
              </defs>
              <ellipse cx="210" cy="296" rx="200" ry="40" fill="url(#heat)" />
              {/* plancha */}
              <rect x="24" y="268" width="372" height="34" rx="12" fill="#2F2F33" />
              <rect x="24" y="268" width="372" height="9" rx="4.5" fill="#55555C" />
              <rect x="44" y="302" width="20" height="26" rx="4" fill="#2F2F33" /><rect x="356" y="302" width="20" height="26" rx="4" fill="#2F2F33" />
              {/* vapor */}
              <g ref={set('steam')} className="steam" style={{ opacity: 0 }} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8">
                <path d="M170 230c-10-14 10-22 0-38s10-24 0-38" /><path d="M210 226c-10-14 10-22 0-38s10-24 0-38" /><path d="M250 230c-10-14 10-22 0-38s10-24 0-38" />
              </g>
              {/* carne */}
              <g ref={set('meat')} style={{ transform: 'translate(210px,268px)' }}>
                <ellipse cx="0" cy="-38" rx="48" ry="38" fill="#DE6A74" />
                <g fill="#F4A3AA" opacity=".9"><circle cx="-18" cy="-52" r="4" /><circle cx="10" cy="-60" r="3" /><circle cx="22" cy="-34" r="4" /><circle cx="-8" cy="-26" r="3" /><circle cx="-30" cy="-34" r="2.5" /></g>
                <ellipse ref={set('cooked')} cx="0" cy="-38" rx="48" ry="38" fill="#7A3E2B" style={{ opacity: 0 }} />
                <ellipse ref={set('crust')} cx="0" cy="-38" rx="50" ry="39" fill="none" stroke="#3E1D10" strokeWidth="5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" style={{ opacity: 0 }} />
              </g>
              {/* chisporroteo */}
              <g ref={set('sizzle')} className="sizzle" style={{ opacity: 0 }} fill="#FFD27A">
                {[[90, 262], [118, 256], [300, 258], [328, 262], [150, 252], [272, 252], [72, 264], [348, 264]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3.5" style={{ animationDelay: `${i * 0.13}s` }} />
                ))}
              </g>
              {/* queso */}
              <g ref={set('cheese')} style={{ opacity: 0 }}>
                <path d="M-100 -20h200l10 14H-110z" fill="#FFC93C" stroke="#E9A400" strokeWidth="3" strokeLinejoin="round" />
                <g ref={set('drips')} style={{ transformOrigin: '0 -6px', transform: 'scaleY(0)' }} fill="#FFC93C" stroke="#E9A400" strokeWidth="3">
                  <path d="M-80 -7c0 18 12 18 12 0zM-30 -7c0 26 13 26 13 0zM24 -7c0 16 11 16 11 0zM70 -7c0 22 12 22 12 0z" />
                </g>
              </g>
              {/* pan */}
              <g ref={set('bun')} style={{ opacity: 0 }}>
                <path d="M-108 0C-108-70 108-70 108 0z" fill="#E9A75B" stroke="#B8732F" strokeWidth="3" />
                <g fill="#FFF3DA"><ellipse cx="-40" cy="-34" rx="6" ry="3.4" transform="rotate(-20 -40 -34)" /><ellipse cx="0" cy="-44" rx="6" ry="3.4" /><ellipse cx="40" cy="-34" rx="6" ry="3.4" transform="rotate(20 40 -34)" /><ellipse cx="-14" cy="-18" rx="6" ry="3.4" /><ellipse cx="22" cy="-16" rx="6" ry="3.4" /></g>
              </g>
              {/* espátula */}
              <g ref={set('spat')} style={{ transformOrigin: '300px 150px' }}>
                <rect x="120" y="150" width="170" height="14" rx="3" fill="url(#metal)" stroke="#7E858F" strokeWidth="2.5" />
                <path d="M286 156L304 146" stroke="#9AA1AA" strokeWidth="9" strokeLinecap="round" />
                <path d="M302 147L388 92" stroke="#E8323C" strokeWidth="18" strokeLinecap="round" />
                <path d="M318 137L376 100" stroke="#FF7A82" strokeWidth="4" strokeLinecap="round" opacity=".6" />
              </g>
              {/* ¡SMASH! */}
              <g ref={set('boom')} style={{ opacity: 0 }}>
                <path d="M0-62l14 30 32-16-8 34 34 6-30 18 22 26-34-4 2 34-28-20-20 28-6-34-34 10 18-28-30-18 34-8-12-32 32 14z" fill="#FFF59D" stroke="#E8323C" strokeWidth="4" strokeLinejoin="round" />
                <text x="0" y="10" textAnchor="middle" className="boom-text">SMASH!</text>
              </g>
            </svg>
            <p className="smash-hint">{t.smash.hint} ↓</p>
          </div>
        </div>
      </div>
    </section>
  );
}
