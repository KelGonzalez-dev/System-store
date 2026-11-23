import { useEffect, useMemo, useState } from 'react';
import { CATS, SEDES, cop, mapsLink, menuFor, sedeById, waLink } from '../data/content';
import { link } from '../router';
import { useCart } from '../hooks/useCart';
import { Icon, ItemIcon, WhatsAppIcon } from '../components/Icons';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const iconOf = (cat) => CATS.find((c) => c.id === cat)?.icon || 'cup';

const last = () => {
  try { return localStorage.getItem('jb:sede'); } catch (e) { return null; }
};

function Picker() {
  const prev = last();
  return (
    <main className="lt-green min-h-screen bg-s1 pb-24 pt-28 text-fg">
      <div className="container-x">
        <p className="eyebrow fade-up">Menú</p>
        <h1 className="h-display fade-up mt-5 text-5xl sm:text-7xl lg:text-8xl" style={{ '--d': '80ms' }}>¿En qué sede<br /><span className="text-acc">estás hoy?</span></h1>
        <p className="fade-up mt-5 max-w-md text-fg/60 lt:text-ink/75" style={{ '--d': '160ms' }}>Cada sede tiene su propio menú y precios. Elige una para ver lo que hay disponible.</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SEDES.map((s, i) => (
            <a key={s.id} {...link(`#/menu/${s.id}`)} className="sede-card sede-pw lt-white pop-in group flex flex-col rounded-[2rem] border border-fg/10 bg-card p-6 text-fg sm:p-8" style={{ '--d': `${220 + i * 90}ms` }}>
              <div className="flex items-start justify-between">
                <span className="sc-n font-display text-6xl font-extrabold leading-none text-transparent sm:text-7xl" style={{ WebkitTextStroke: '2px #62bf00' }}>{s.n}</span>
                <div className="flex items-center gap-2">
                  {prev === s.id && <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-ink">Tu última sede</span>}
                  <span className="sc-m rounded-full border border-fg/20 px-3 py-1 text-xs font-bold uppercase tracking-[.2em] text-fg/75">{s.city}</span>
                </div>
              </div>
              <h2 className="sc-t mt-8 font-display text-4xl font-extrabold uppercase leading-[.95] sm:text-5xl">{s.name}</h2>
              <p className="sc-m mt-3 flex items-start gap-2 text-fg/60"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0" />{s.address}</p>
              <span className="sc-t mt-8 inline-flex items-center gap-2 font-bold uppercase tracking-[.1em]">Ver menú<span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-ink transition-[transform,background-color,color] duration-500 group-hover:translate-x-1 group-hover:bg-ink group-hover:text-brand"><Icon name="arrow" className="h-4 w-4" /></span></span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function ItemCard({ it, sede, i }) {
  const cart = useCart();
  const q = cart.sede === sede.id ? cart.qty(it.id) : 0;
  return (
    <article className="mi pop-in group flex gap-4 rounded-3xl border border-fg/10 bg-card p-4 text-fg transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(7,9,6,.35)] sm:p-5" style={{ '--d': `${Math.min(i, 9) * 45}ms` }}>
      <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl p-3 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 sm:h-28 sm:w-28" style={{ background: `${it.c}22` }}>
        <ItemIcon type={iconOf(it.cat)} color={it.c} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-xl font-extrabold uppercase leading-[1.02] sm:text-2xl">{it.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-fg/60">{it.desc}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="font-display text-2xl font-extrabold tabular-nums text-acc">{cop(it.price)}</span>
          {q === 0 ? (
            <button type="button" onClick={() => cart.add(sede.id, it)} aria-label={`Agregar ${it.name}`} className="grid h-11 w-11 place-items-center rounded-full bg-fg text-inv transition-[transform,background-color] duration-300 hover:scale-110 hover:bg-brand hover:text-ink lt:bg-brand lt:text-white lt:hover:bg-brand-deep lt:hover:text-white active:scale-90"><Icon name="plus" className="h-5 w-5" stroke={2.4} /></button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-fg p-1 text-inv lt:bg-brand lt:text-white">
              <button type="button" onClick={() => cart.dec(it.id)} aria-label="Quitar uno" className="grid h-9 w-9 place-items-center rounded-full hover:bg-inv/15"><Icon name="minus" className="h-4 w-4" stroke={2.4} /></button>
              <span key={q} className="bump w-5 text-center text-sm font-bold tabular-nums">{q}</span>
              <button type="button" onClick={() => cart.add(sede.id, it)} aria-label="Agregar uno" className="grid h-9 w-9 place-items-center rounded-full bg-brand text-ink hover:brightness-110 lt:bg-white lt:text-brand-deep"><Icon name="plus" className="h-4 w-4" stroke={2.4} /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SedeMenu({ sede }) {
  const cart = useCart();
  const [cat, setCat] = useState('todo');
  const [q, setQ] = useState('');
  const items = useMemo(() => menuFor(sede.id), [sede.id]);
  const cats = useMemo(() => CATS.filter((c) => items.some((i) => i.cat === c.id)), [items]);

  useEffect(() => {
    try { localStorage.setItem('jb:sede', sede.id); } catch (e) {}
    setCat('todo');
    setQ('');
  }, [sede.id]);

  const list = useMemo(() => {
    const t = norm(q.trim());
    return items.filter((i) => (cat === 'todo' || i.cat === cat) && (!t || norm(`${i.name} ${i.desc}`).includes(t)));
  }, [items, cat, q]);

  const groups = cat === 'todo' && !q ? cats.map((c) => ({ c, list: items.filter((i) => i.cat === c.id) })) : [{ c: null, list }];
  const other = cart.sede && cart.sede !== sede.id ? sedeById(cart.sede) : null;
  let n = 0;

  return (
    <main className="min-h-screen bg-s1 pb-28 text-fg">
      <section className="lt-green relative overflow-hidden bg-s2 pb-12 pt-28 text-fg">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(50% 80% at 85% 20%, rgba(98,191,0,.35), transparent 70%)' }} />
        <div className="container-x relative">
          <a {...link('#/menu')} className="fade-up inline-flex items-center gap-2 rounded-full border border-fg/20 px-4 py-2 text-sm font-bold transition-colors lt:border-white/70 hover:border-brand hover:text-acc"><Icon name="swap" className="h-4 w-4" />Cambiar sede</a>
          <h1 className="h-display fade-up mt-6 text-5xl sm:text-7xl lg:text-8xl" style={{ '--d': '80ms' }}>{sede.name}</h1>
          <div className="fade-up mt-5 flex flex-wrap items-center gap-3" style={{ '--d': '160ms' }}>
            <span className="chip"><Icon name="pin" className="h-4 w-4 text-acc" />{sede.address}</span>
            <a href={mapsLink(sede)} target="_blank" rel="noopener noreferrer" className="chip transition-colors hover:border-brand hover:text-acc">Cómo llegar<Icon name="arrow" className="h-4 w-4" /></a>
            <a href={waLink(sede, `Hola ${sede.name}, tengo una pregunta.`)} target="_blank" rel="noopener noreferrer" className="chip transition-colors hover:border-brand hover:text-acc"><WhatsAppIcon className="h-4 w-4 text-acc" />{sede.wad}</a>
          </div>
        </div>
      </section>

      <div className="sticky top-[60px] z-30 border-b border-fg/10 bg-s1/95 backdrop-blur">
        <div className="container-x flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Categorías">
            {[{ id: 'todo', name: 'Todo' }, ...cats].map((c) => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-[background-color,color,transform] duration-300 active:scale-95 ${cat === c.id ? 'bg-brand text-ink' : 'bg-fg/5 text-fg/70 hover:bg-fg/10'}`}>{c.name}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-full bg-fg/5 px-4 md:w-72">
            <Icon name="search" className="h-4 w-4 text-fg/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en el menú" aria-label="Buscar" className="w-full bg-transparent py-2.5 text-[16px] placeholder:text-fg/40 focus:outline-none md:text-sm" />
          </label>
        </div>
      </div>

      <div className="container-x pt-8">
        {other && <p className="fade-up mb-6 rounded-2xl bg-brand/15 px-5 py-3 text-sm text-fg/80">Tienes un pedido de <b>{other.name}</b>. Si agregas algo de esta sede, ese pedido se reemplaza.</p>}
        {list.length === 0 && <p className="py-20 text-center font-display text-3xl font-extrabold uppercase text-fg/40">No encontramos eso en esta sede</p>}
        {groups.map(({ c, list: l }) => (
          <section key={c ? c.id : 'r'} className="mb-12">
            {c && <h2 className="fade-up mb-5 flex items-center gap-3 font-display text-3xl font-extrabold uppercase sm:text-4xl"><span className="h-3 w-3 rounded-full bg-brand" />{c.name}<span className="text-lg text-fg/35">{l.length}</span></h2>}
            <div key={`${cat}-${q}`} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {l.map((it) => <ItemCard key={it.id} it={it} sede={sede} i={n++} />)}
            </div>
          </section>
        ))}
      </div>

      {cart.count > 0 && cart.sede === sede.id && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <button type="button" onClick={() => cart.setOpen(true)} className="pop-in mx-auto flex w-full max-w-xl items-center justify-between rounded-full bg-brand px-6 py-4 text-ink shadow-[0_18px_40px_-10px_rgba(0,0,0,.5)] lt:bg-brand-deep lt:text-white transition-transform hover:scale-[1.02] active:scale-95">
            <span className="flex items-center gap-3 font-bold"><Icon name="bag" className="h-5 w-5" /><span key={cart.pulse} className="bump">{cart.count} {cart.count === 1 ? 'producto' : 'productos'}</span></span>
            <span className="flex items-center gap-3 font-display text-xl font-extrabold tabular-nums">{cop(cart.total)}<Icon name="arrow" className="h-5 w-5" /></span>
          </button>
        </div>
      )}
    </main>
  );
}

export default function Menu({ sedeId }) {
  const sede = sedeId ? sedeById(sedeId) : null;
  if (!sede) return <Picker />;
  return <SedeMenu sede={sede} />;
}
