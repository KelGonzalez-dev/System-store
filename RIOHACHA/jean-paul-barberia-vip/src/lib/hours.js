import { HOURS } from '../data';

export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t)?.value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')), ymd: `${g('year')}-${g('month')}-${g('day')}` };
}
export const fmtMin = (m) => { const h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${h < 12 ? 'a. m.' : 'p. m.'}`; };
export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function openNow() { const { day, min } = bogotaNow(); const h = HOURS[day]; return h && min >= h[0] && min < h[1] ? h[1] : null; }

// Próximos días con horario
export function nextDays(n = 10) {
  const now = bogotaNow();
  const [y, m, d] = now.ymd.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const dt = new Date(y, m - 1, d + i, 12);
    return { key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`, dow: dt.getDay(), d: dt.getDate(), m: dt.getMonth(), i };
  }).filter((x) => HOURS[x.dow]);
}
export function slotsFor(day, mins = 45) {
  const h = HOURS[day.dow];
  if (!h) return [];
  const now = bogotaNow();
  const out = [];
  for (let t = h[0]; t + mins <= h[1]; t += 30) if (day.i > 0 || t > now.min + 30) out.push(t);
  return out;
}
export const dayLabel = (x) => (x.i === 0 ? 'Hoy' : x.i === 1 ? 'Mañana' : DAYS[x.dow]);
