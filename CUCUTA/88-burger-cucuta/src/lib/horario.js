import { HORARIO } from '../data';

export function bogotaAhora() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t)?.value;
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')) };
}
export const hora = (m) => { m %= 1440; const h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${h < 12 ? 'a. m.' : 'p. m.'}`; };
export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** ¿Abierto ahora? Tiene en cuenta horarios que pasan la medianoche (4 p. m. – 1 a. m.). */
export function abierto() {
  const { dia, min } = bogotaAhora();
  const hoy = HORARIO[dia];
  const ayer = HORARIO[(dia + 6) % 7];
  if (ayer && ayer[1] > 1440 && min < ayer[1] - 1440) return { abierto: true, texto: `Abierto hasta la ${hora(ayer[1])}` };
  if (hoy && min >= hoy[0] && min < hoy[1]) return { abierto: true, texto: `Abierto hasta la ${hora(hoy[1])}` };
  if (hoy && min < hoy[0]) return { abierto: false, texto: `Abrimos hoy a las ${hora(hoy[0])}` };
  const man = HORARIO[(dia + 1) % 7];
  return { abierto: false, texto: man ? `Abrimos mañana a las ${hora(man[0])}` : 'Cerrado' };
}
