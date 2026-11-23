import { INSTAGRAM, NAV, SEDES, waLink } from '../data/content';
import { link } from '../router';
import Logo from './Logo';
import { Icon, WhatsAppIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="lt-green bg-s1 text-fg">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-20 w-auto text-fg" />
          <p className="mt-6 max-w-xs text-fg/60 lt:text-fg/90">El sabor y la calidad de lo natural. Domicilios únicamente por WhatsApp, no tomamos pedidos por DM.</p>
          <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-3 font-bold text-fg transition-colors hover:text-acc"><Icon name="instagram" className="h-6 w-6" />{INSTAGRAM.handle}</a>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow">Navegar</p>
          <ul className="mt-5 space-y-3">
            {NAV.map(([id, label]) => (
              <li key={id}><a {...link(`#${id}`)} className="font-bold text-fg/75 transition-colors hover:text-acc lt:text-fg">{label}</a></li>
            ))}
            <li><a {...link('#/menu')} className="font-bold text-fg/75 transition-colors hover:text-acc lt:text-fg">Menú por sede</a></li>
          </ul>
        </div>

        <div className="md:col-span-5">
          <p className="eyebrow">Escríbenos por sede</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {SEDES.map((s) => (
              <li key={s.id}>
                <a href={waLink(s, `Hola ${s.name}, quiero hacer un pedido.`)} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border border-fg/10 p-4 transition-[background-color,color,border-color,transform] duration-300 hover:border-brand hover:bg-brand/10 lt:border-2 lt:border-white/40 lt:hover:-translate-y-0.5 lt:hover:border-white lt:hover:bg-white lt:hover:text-brand-deep">
                  <span className="block font-display text-lg font-extrabold uppercase leading-tight">{s.name}</span>
                  <span className="mt-1 flex items-center gap-2 text-sm text-fg/60 group-hover:text-acc lt:text-fg/90 lt:group-hover:text-brand-deep"><WhatsAppIcon className="h-4 w-4" />{s.wad}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-fg/10 py-5 text-center text-xs text-fg/40 lt:border-white/30 lt:text-fg/80">© {new Date().getFullYear()} Jugos Bar. Todos los derechos reservados.</div>
    </footer>
  );
}
