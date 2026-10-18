import { useState } from 'react';
import { CATS, CONFIG, L, PRODUCTS } from '../data';
import { scrollToTarget } from '../lib/scroll';

const TRENDING = ['Cemento', 'Pegante', 'Varilla 3/8', 'Bloque N.º 4', 'Tubo PVC', 'Vinilo'];

// Hero: buscador grande, categorías rápidas, foto real del local y sellos de confianza
export default function Hero({ onSearch, onCat }) {
  const [q, setQ] = useState('');
  return (
    <section id="inicio" className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-wrap">
        <div className="hero-copy">
          <p className="pill intro" style={{ '--d': '0.1s' }}><b>+{CONFIG.years} años</b> construyendo con Riohacha</p>
          <h1 className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>Todo para tu obra,</span></span>
            <span className="hl"><span className="hl-in red" style={{ '--i': 1 }}>al mejor precio.</span></span>
          </h1>
          <p className="hero-p intro" style={{ '--d': '0.8s' }}>Cemento, acero, bloques, pegantes, plomería, eléctricos, pinturas y herramientas. Precios al detal y <b>al por mayor</b>, con asesoría para que tu obra quede bien desde la base.</p>
          <form className="hero-search intro" style={{ '--d': '1s' }} onSubmit={(e) => { e.preventDefault(); onSearch(q); }} role="search">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`¿Qué necesitas? Tenemos ${PRODUCTS.length}+ productos`} aria-label="Buscar productos" />
            <button type="submit" className="btn btn-red">Buscar</button>
          </form>
          <div className="trending intro" style={{ '--d': '1.15s' }}>
            <span>Más buscado:</span>
            {TRENDING.map((t) => <button key={t} type="button" onClick={() => onSearch(t)}>{t}</button>)}
          </div>
        </div>
        <div className="hero-visual intro-pop">
          <div className="hv-photo"><img src={L.fachada} alt="Fachada de Materiales El Descuento en la Cra 7 de Riohacha" fetchpriority="high" /></div>
          <div className="hv-badge b1"><b>Por mayor</b><span>Precio especial por volumen</span></div>
          <div className="hv-badge b2"><b>Empresa formalizada</b><span>S.A.S ZESE</span></div>
          <div className="hv-badge b3"><b>Pedidos por WhatsApp</b><span>318 400 9867</span></div>
        </div>
      </div>
      <div className="wrap quick-cats intro" style={{ '--d': '1.3s' }}>
        {CATS.slice(0, 8).map((c) => <button key={c.id} type="button" onClick={() => onCat(c.id)}>{c.n}</button>)}
        <button type="button" className="more" onClick={() => scrollToTarget('#categorias')}>Ver todas →</button>
      </div>
    </section>
  );
}
