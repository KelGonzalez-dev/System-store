import { HORARIO } from '../data';

export function bogota() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t)?.value;
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')), hoy: `${g('year')}-${g('month')}-${g('day')}` };
}
export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const hora = (m) => { m %= 1440; const h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${h < 12 ? 'a. m.' : 'p. m.'}`; };
/** ¿Abierto ahora? (considera cierres después de medianoche) */
export function abierto() {
  const { dia, min } = bogota();
  const ayer = HORARIO[(dia + 6) % 7];
  if (ayer && ayer[1] > 1440 && min < ayer[1] - 1440) return { abierto: true, texto: `Abierto hasta las ${hora(ayer[1])}` };
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] && min < hoy[1]) return { abierto: true, texto: `Abierto hasta las ${hora(hoy[1])}` };
  if (hoy && min < hoy[0]) return { abierto: false, texto: `Hoy abrimos a las ${hora(hoy[0])}` };
  for (let i = 1; i < 8; i++) { const x = HORARIO[(dia + i) % 7]; if (x) return { abierto: false, texto: `Abrimos el ${DIAS[(dia + i) % 7].toLowerCase()} a las ${hora(x[0])}` }; }
  return { abierto: false, texto: 'Cerrado' };
}
