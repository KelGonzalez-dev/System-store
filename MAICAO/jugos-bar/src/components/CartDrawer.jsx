import { useEffect, useState } from 'react';
import { cop, sedeById, waLink } from '../data/content';
import { useCart } from '../hooks/useCart';
import { Icon, WhatsAppIcon } from './Icons';

const field = 'w-full rounded-xl border-2 border-transparent bg-fg/5 px-4 py-3 text-[16px] text-fg placeholder:text-fg/40 focus:border-brand focus:outline-none';

export default function CartDrawer() {
  const cart = useCart();
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const sede = sedeById(cart.sede);
  const open = cart.open;

  useEffect(() => {
    if (!open) return;
    const key = (e) => e.key === 'Escape' && cart.setOpen(false);
    window.addEventListener('keydown', key);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open && cart.count === 0) cart.setOpen(false);
  }, [cart.count, open]);

  const send = () => {
    if (!sede) return;
    const lines = cart.list.map((l) => `${l.qty}x ${l.item.name} - ${cop(l.item.price * l.qty)}`).join('\n');
    const text = `Hola ${sede.name}, quiero hacer un pedido:\n\n${lines}\n\nTotal: ${cop(cart.total)}${name ? `\nNombre: ${name}` : ''}${addr ? `\nDirección: ${addr}` : ''}`;
    window.open(waLink(sede, text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed inset-0 z-[80] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={() => cart.setOpen(false)} className={`drawer-bg absolute inset-0 bg-ink/50 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside role="dialog" aria-label="Tu pedido" className={`drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-s1 text-fg shadow-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="lt-green flex items-center justify-between border-b border-fg/10 bg-s2 px-5 py-4">
          <div>
            <p className="font-display text-3xl font-extrabold uppercase">Tu pedido</p>
            {sede && <p className="text-sm font-bold text-acc">{sede.name}</p>}
          </div>
          <button type="button" onClick={() => cart.setOpen(false)} aria-label="Cerrar" className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 lt:border-white/60 hover:border-brand hover:text-acc"><Icon name="close" /></button>
        </div>

        <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {cart.list.map((l) => (
            <li key={l.item.id} className="flex items-center gap-3 rounded-2xl bg-fg/5 p-3">
              <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: l.item.c }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{l.item.name}</p>
                <p className="text-sm text-fg/60">{cop(l.item.price)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => cart.dec(l.item.id)} aria-label="Quitar uno" className="grid h-8 w-8 place-items-center rounded-full border-2 border-fg/20 text-fg hover:bg-fg/10"><Icon name="minus" className="h-4 w-4" /></button>
                <span className="w-6 text-center font-bold tabular-nums">{l.qty}</span>
                <button type="button" onClick={() => cart.add(cart.sede, l.item)} aria-label="Agregar uno" className="grid h-8 w-8 place-items-center rounded-full bg-brand text-ink hover:brightness-110"><Icon name="plus" className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-3 border-t border-fg/10 px-5 py-5">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" className={field} />
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Dirección de entrega" autoComplete="street-address" className={field} />
          <div className="flex items-end justify-between pt-1">
            <span className="text-sm font-bold uppercase tracking-widest text-fg/50">Total</span>
            <span className="font-display text-4xl font-extrabold tabular-nums text-acc">{cop(cart.total)}</span>
          </div>
          <button type="button" onClick={send} className="btn btn-green w-full py-4"><WhatsAppIcon className="h-5 w-5" />Enviar pedido por WhatsApp</button>
          <button type="button" onClick={cart.clear} className="w-full text-center text-sm text-fg/50 transition-colors hover:text-fg">Vaciar pedido</button>
        </div>
      </aside>
    </div>
  );
}
