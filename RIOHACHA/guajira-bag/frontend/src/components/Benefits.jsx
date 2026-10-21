import { HandHeart, MessageCircle, Sparkles, Truck } from 'lucide-react';

const ITEMS = [
  { I: HandHeart, t: 'Tejidas a mano', d: 'Por artesanas Wayuu y Kankuamas' },
  { I: Sparkles, t: 'Piezas únicas', d: 'Nadie más tendrá la tuya' },
  { I: Truck, t: 'Envíos a toda Colombia', d: 'Te la llevamos hasta tu casa' },
  { I: MessageCircle, t: 'Pedido por WhatsApp', d: 'Fácil, rápido y con atención real' },
];

export default function Benefits() {
  return (
    <ul className="benefits">
      {ITEMS.map(({ I, t, d }) => (
        <li key={t}><span className="benefits__ic"><I size={18} strokeWidth={1.6} /></span><div><b>{t}</b><small>{d}</small></div></li>
      ))}
    </ul>
  );
}
