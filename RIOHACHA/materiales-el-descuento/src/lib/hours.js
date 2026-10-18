import { HOURS } from '../data';

export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t)?.value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')), ymd: `${g('year')}-${g('month')}-${g('day')}` };
}
export const fmtMin = (m) => { const h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; if (h === 12 && !mi) return '12 m.'; return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${h < 12 ? 'a. m.' : 'p. m.'}`; };
export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export function status() {
  const { day, min } = bogotaNow();
  const h = HOURS[day];
  if (h && min >= h[0] && min < h[1]) return { open: true, text: `Abierto ahora · cierra a las ${fmtMin(h[1])}` };
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7; const hh = HOURS[d];
    if (!hh) continue;
    if (i === 0 && min < hh[0]) return { open: false, text: `Cerrado · abre hoy a las ${fmtMin(hh[0])}` };
    if (i > 0) return { open: false, text: `Cerrado · abre ${i === 1 ? 'mañana' : DAYS[d].toLowerCase()} a las ${fmtMin(hh[0])}` };
  }
  return { open: false, text: 'Cerrado' };
}
