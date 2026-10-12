import { useMemo, useState } from 'react';
import Photo from './Photo';
import { AddButton } from './Product';
import { FAMILIES, PRODUCTS, fmt, waLink } from '../data';

const Q = [
  { k: 'who', q: '¿Para quién es?', o: [['ella', 'Para mí (ella)'], ['el', 'Para él'], ['all', 'Me da igual']] },
  { k: 'fam', q: '¿Qué aroma te enamora?', o: [['floral', '🌸 Flores'], ['amaderado', '🪵 Maderas'], ['citrico', '🍋 Cítrico'], ['frutal', '🍓 Frutal'], ['aromatico', '🌊 Fresco'], ['oriental', '🌙 Envolvente']] },
  { k: 'when', q: '¿Para cuándo?', o: [['dia', '☀️ Día a día'], ['noche', '✨ Ocasiones especiales']] },
];

// "Encuentra tu aroma": tres preguntas y te recomiendo perfumes del catálogo (las tarjetas giran como cartas)
export default function Quiz() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const choose = (k, v) => { setAns((a) => ({ ...a, [k]: v })); setStep((s) => s + 1); };
  const results = useMemo(() => {
    if (step < Q.length) return [];
    const perf = PRODUCTS.filter((p) => p.cat === 'perfumes');
    const score = (p) => (p.family === ans.fam ? 3 : 0) + (ans.who === 'all' || p.for === ans.who || p.for === 'all' ? 2 : -3) + (ans.when === 'noche' ? (p.price > 140000 ? 1 : 0) : (p.price <= 140000 ? 1 : 0));
    return perf.map((p) => [score(p), p]).sort((a, b) => b[0] - a[0]).slice(0, 3).map((x) => x[1]);
  }, [step, ans]);
  const reset = () => { setStep(0); setAns({}); };
  return (
    <section id="aroma" className="quiz-sec">
      <div className="wrap py-[clamp(80px,10vw,120px)]">
        <div className="quiz-card">
          <p className="eyebrow justify-center">Asesoría de aromas</p>
          <h2 className="sec-title text-center">Encuentra tu <em>aroma</em></h2>
          <div className="quiz-dots" aria-hidden="true">{Q.map((_, i) => <i key={i} className={i < step ? 'on' : ''} />)}</div>
          {step < Q.length ? (
            <div key={step} className="quiz-q">
              <h3>{Q[step].q}</h3>
              <div className="quiz-opts">{Q[step].o.map(([v, l]) => <button key={v} type="button" onClick={() => choose(Q[step].k, v)}>{l}</button>)}</div>
              {step > 0 && <button type="button" className="quiz-back" onClick={() => setStep((s) => s - 1)}>← Atrás</button>}
            </div>
          ) : (
            <div className="quiz-res">
              <h3>Te van a encantar {ans.fam ? `(${FAMILIES[ans.fam].toLowerCase()})` : ''}</h3>
              <div className="quiz-cards">
                {results.map((p, i) => (
                  <div key={p.id} className="qc" style={{ '--i': i }}>
                    <div className="qc-art"><Photo id={p.img} art={p.art} label={p.line} w={400} /></div>
                    <b>{p.name}</b>
                    <span>{p.notes}</span>
                    <em>{fmt.format(p.price)}</em>
                    <AddButton p={p} />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-line" onClick={reset}>Volver a empezar</button>
                <a className="btn btn-terra" href={waLink('¡Hola Zulima! 🌿 Hice el test de aromas y quiero que me asesores para escoger mi perfume.')} target="_blank" rel="noopener noreferrer">Quiero asesoría</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
