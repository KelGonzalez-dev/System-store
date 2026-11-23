import { useEffect, useMemo, useRef, useState } from 'react';
import Foto from './Foto';
import Art from './Art';
import { ADICIONES, CATEGORIAS, CON_ADICIONES, MENU, fmt } from '../data';
import { usePedido } from '../pedido';
import { lockScroll } from '../lib/scroll';

/** Tarjeta de plato con inclinación 3D al pasar el mouse. */
function Tarjeta({ plato, i, onAbrir, onRapido }) {
  const ref = useRef(null);
  const mover = (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    ref.current.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`);
  };
  const salir = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };
  return (
    <article ref={ref} className="plt" style={{ '--i': i }} onMouseMove={mover} onMouseLeave={salir} onClick={() => onAbrir(plato)}>
      <div className="plt__foto">
        <Foto id={plato.foto} arte={plato.arte} alt={plato.nombre} w={700} />
        {plato.etiquetas?.[0] && <span className="plt__tag">{plato.etiquetas[0]}</span>}
        <span className="plt__brillo" aria-hidden="true" />
      </div>
      <div className="plt__info">
        <h3>{plato.nombre}</h3>
        <p>{plato.desc}</p>
        <div className="plt__pie">
          <b>{fmt(plato.precio)}</b>
          <button type="button" className="plt__mas" aria-label={`Agregar ${plato.nombre}`} onClick={(e) => { e.stopPropagation(); onRapido(plato); }}>+</button>
        </div>
      </div>
    </article>
  );
}

/** Ventana del plato: foto grande, adiciones, cantidad y nota. */
function Detalle({ plato, onCerrar }) {
  const { agregar, setAbierto } = usePedido();
  const [cant, setCant] = useState(1);
  const [ads, setAds] = useState([]);
  const [nota, setNota] = useState('');
  const conAds = CON_ADICIONES.includes(plato.cat);
  const total = (plato.precio + ads.reduce((n, a) => n + a.precio, 0)) * cant;
  useEffect(() => {
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [onCerrar]);
  const toggle = (a) => setAds((v) => (v.some((x) => x.id === a.id) ? v.filter((x) => x.id !== a.id) : [...v, a]));
  return (
    <div className="det" role="dialog" aria-modal="true" aria-label={plato.nombre} onClick={onCerrar}>
      <div className="det__card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="det__x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        <div className="det__foto"><Foto id={plato.foto} arte={plato.arte} alt={plato.nombre} w={1200} eager /></div>
        <div className="det__info">
          {plato.etiquetas?.length > 0 && <div className="det__tags">{plato.etiquetas.map((t) => <span key={t}>{t}</span>)}</div>}
          <h3>{plato.nombre}</h3>
          <p>{plato.desc}</p>
          {conAds && (
            <div className="det__ads">
              <b>¿Le agregamos algo?</b>
              <div>{ADICIONES.map((a) => <button key={a.id} type="button" className={ads.some((x) => x.id === a.id) ? 'on' : ''} onClick={() => toggle(a)}>{a.nombre} <small>+{fmt(a.precio)}</small></button>)}</div>
            </div>
          )}
          <label className="det__nota">
            <span>Nota para la cocina (opcional)</span>
            <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: sin cebolla, salsas aparte…" maxLength={80} />
          </label>
          <div className="det__pie">
            <div className="cant">
              <button type="button" onClick={() => setCant(Math.max(1, cant - 1))} aria-label="Menos">−</button>
              <b>{cant}</b>
              <button type="button" onClick={() => setCant(cant + 1)} aria-label="Más">+</button>
            </div>
            <button type="button" className="btn btn--queso det__add" onClick={() => { agregar(plato, { cantidad: cant, adiciones: ads, nota: nota.trim() }); onCerrar(); setAbierto(true); }}>
              Agregar · {fmt(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Menú: categorías con ícono, plato estrella de cada categoría en grande y tarjetas con inclinación 3D.
 * Cada plato se agrega al pedido (con adiciones y nota) y el pedido se envía por WhatsApp.
 */
export default function Menu({ abrirPlato, setAbrirPlato }) {
  const [cat, setCat] = useState('burgers');
  const { agregar } = usePedido();
  const [aviso, setAviso] = useState(null);
  const lista = useMemo(() => MENU.filter((m) => m.cat === cat), [cat]);
  const estrella = lista.find((m) => m.estrella) || lista[0];
  const resto = lista.filter((m) => m !== estrella);
  const C = CATEGORIAS.find((c) => c.id === cat);
  const rapido = (p) => {
    if (CON_ADICIONES.includes(p.cat)) { setAbrirPlato(p); return; }
    agregar(p);
    setAviso(p.nombre);
    setTimeout(() => setAviso(null), 1600);
  };
  return (
    <section id="menu" className="menu">
      <div className="wrap">
        <div className="menu__head">
          <div>
            <p className="eyebrow">El menú</p>
            <h2 className="titulo">Elige tu <span className="queso">antojo.</span></h2>
          </div>
          <p className="menu__lead">Toca un plato para verlo en grande, agregarle lo que quieras y armar tu pedido. Lo envías por WhatsApp en un clic.</p>
        </div>
        <nav className="cats" aria-label="Categorías del menú">
          {CATEGORIAS.map((c) => (
            <button key={c.id} type="button" className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>
              <span className="cats__ic"><Art tipo={c.icono} /></span>{c.nombre}<small>{MENU.filter((m) => m.cat === c.id).length}</small>
            </button>
          ))}
        </nav>

        <div key={cat} className="menu__cuerpo">
          <article className="estrella" onClick={() => setAbrirPlato(estrella)}>
            <div className="estrella__foto"><Foto id={estrella.foto} arte={estrella.arte} alt={estrella.nombre} w={1200} /></div>
            <div className="estrella__info">
              <span className="estrella__kick">★ Estrella de {C.nombre.toLowerCase()}</span>
              <h3>{estrella.nombre}</h3>
              <p>{estrella.desc}</p>
              <div className="estrella__pie">
                <b>{fmt(estrella.precio)}</b>
                <button type="button" className="btn btn--queso" onClick={(e) => { e.stopPropagation(); rapido(estrella); }}>Lo quiero</button>
              </div>
            </div>
            <svg className="estrella__gotas" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h400v8c-12 0-14 22-26 22s-12-18-24-18-10 28-24 28-12-30-26-30-12 16-24 16S262 10 250 10s-12 24-26 24-12-22-24-22-10 14-22 14-14-20-26-20-12 26-26 26-12-26-24-26-12 12-24 12-14-18-26-18-12 22-24 22S12 8 0 8z" fill="#FFC531" /></svg>
          </article>
          <p className="menu__lema">{C.lema}</p>
          <div className="plts">
            {resto.map((p, i) => <Tarjeta key={p.id} plato={p} i={i} onAbrir={setAbrirPlato} onRapido={rapido} />)}
          </div>
        </div>
        <p className="menu__nota">Precios de referencia. Domicilio con valor según el barrio.</p>
      </div>
      {abrirPlato && <Detalle plato={abrirPlato} onCerrar={() => setAbrirPlato(null)} />}
      {aviso && <div className="aviso" role="status">✓ {aviso} agregado al pedido</div>}
    </section>
  );
}
