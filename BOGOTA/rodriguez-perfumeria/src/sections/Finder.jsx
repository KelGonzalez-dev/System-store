import { useMemo, useState } from 'react';
import { PRODUCTS, QUIZ, cop, waLink } from '../data/content';
import Reveal from '../components/Reveal';
import ProductArt from '../components/ProductArt';
import { WhatsAppIcon } from '../components/Icons';

const score = (p, a) =>
  (a.who === 'any' ? 2 : p.gender === a.who ? 3 : p.gender === 'unisex' ? 2 : 0) +
  (p.occasions.includes(a.occ) ? 3 : 0) +
  (p.intensity === a.int ? 2 : 0);

export default function Finder() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const done = step >= QUIZ.length;

  const best = useMemo(() => (done ? [...PRODUCTS].sort((a, b) => score(b, ans) - score(a, ans))[0] : null), [done, ans]);
  const choose = (k, v) => { setAns((a) => ({ ...a, [k]: v })); setStep((s) => s + 1); };
  const reset = () => { setAns({}); setStep(0); };

  return (
    <section id="asesor" className="cv-auto relative overflow-hidden bg-noir py-20 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,106,.14), transparent 65%)' }} />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Asesor</p>
          <h2 className="h-display mt-5 text-5xl sm:text-7xl">
            Encuentra <span className="glow-gold block">tu perfume ideal</span>
          </h2>
          <p className="mt-6 max-w-sm text-ivory/60">Tres preguntas. Diez segundos. Una fragancia hecha para ti.</p>
        </Reveal>

        <Reveal v="right" delay={120} className="lg:col-span-7">
          <div className="hairline s3d-r rounded-[2rem] border bg-ink p-6 sm:p-10">
            {!done ? (
              <div key={step} className="fade-up">
                <div className="flex items-center gap-2" aria-hidden="true">
                  {QUIZ.map((_, n) => <span key={n} className={`h-px flex-1 transition-colors duration-500 ${n <= step ? 'bg-gold' : 'bg-ivory/15'}`} />)}
                </div>
                <p className="mt-6 font-body text-[11px] font-medium uppercase tracking-[.3em] text-gold">Pregunta {step + 1} / {QUIZ.length}</p>
                <h3 className="h-display mt-3 text-4xl sm:text-5xl">{QUIZ[step].q}</h3>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {QUIZ[step].o.map(([v, label]) => (
                    <button key={v} type="button" onClick={() => choose(QUIZ[step].k, v)} className="hairline group rounded-2xl border px-5 py-4 text-left font-display text-2xl transition-all duration-500 hover:border-gold hover:bg-gold/10 active:scale-[.98]">
                      <span className="transition-colors group-hover:text-gold-light">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="fade-up grid items-center gap-6 sm:grid-cols-[10rem_1fr]">
                <div className="relative mx-auto h-48 w-32 sm:h-60 sm:w-40">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${best.glow}55, transparent 65%)` }} />
                  <ProductArt p={best} className="relative h-full w-full" />
                </div>
                <div>
                  <p className="font-body text-[11px] font-medium uppercase tracking-[.3em] text-gold">Tu perfume ideal</p>
                  <h3 className="h-display mt-2 text-5xl">{best.name}</h3>
                  <p className="mt-1 font-display text-xl text-gold">{best.family}</p>
                  <p className="mt-3 text-sm text-ivory/60">{[...best.notes.top, ...best.notes.heart, ...best.notes.base].slice(0, 5).join(' · ')}</p>
                  <p className="gold-text mt-4 font-display text-4xl tabular-nums">{cop(best.price)}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href={waLink(`Hola Rodriguez Perfumería, el asesor me recomendó *${best.name}*. ¿Me das más información?`)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-4 w-4" />Lo quiero</a>
                    <button type="button" onClick={reset} className="btn btn-line">Repetir</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
