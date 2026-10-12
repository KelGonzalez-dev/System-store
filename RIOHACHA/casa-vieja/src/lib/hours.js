import { HOURS } from '../data';

// Hora actual en Colombia
export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const h = Number(get('hour')) % 24;
  return { day, min: h * 60 + Number(get('minute')), hour: h };
}

export function fmtMin(m, lang = 'es') {
  const mm = m % 1440, h = Math.floor(mm / 60), min = mm % 60;
  const h12 = h % 12 || 12;
  const sfx = lang === 'en' ? (h < 12 ? 'a.m.' : 'p.m.') : (h < 12 ? 'a. m.' : 'p. m.');
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''} ${sfx}`;
}

// ¿Está abierto? (tiene en cuenta los cierres después de medianoche)
export function status() {
  const { day, min, hour } = bogotaNow();
  const today = HOURS[day];
  const prev = HOURS[(day + 6) % 7];
  if (prev && prev[1] > 1440 && min < prev[1] - 1440) return { open: true, close: prev[1], day, hour };
  if (today && min >= today[0] && min < today[1]) return { open: true, close: today[1], day, hour };
  return { open: false, day, hour, opens: today ? today[0] : null };
}

// De día (6 a. m. – 6 p. m.) o de noche, según la hora de Riohacha
export const isNightNow = () => { const { hour } = bogotaNow(); return hour >= 18 || hour < 6; };
