// ============================================================
// JEAN PAUL · BARBERÍA VIP — Riohacha
// "Elegancia para grandes, cariño para pequeños"
// Lo marcado con ⚠️ hay que confirmarlo con el cliente.
// ============================================================

export const CONFIG = {
  // Enlace de WhatsApp de su perfil (abre el chat del negocio)
  waMessage: 'https://wa.me/message/SR4ESMOQ4OZNE1',
  // ⚠️ Número de WhatsApp con 57 adelante (ej. 573001234567). Con él, la reserva llega ESCRITA en el chat.
  //    Si se deja vacío, se abre el enlace de su perfil y los datos de la cita se copian para pegarlos.
  phone: '',
  instagram: 'barberia_jeanpaul_vip',
  address: 'Carrera 15 # 15-72, Local 102',
  city: 'Riohacha, La Guajira',
  maps: 'https://www.google.com/maps/search/?api=1&query=Carrera+15+%2315-72+Riohacha+La+Guajira',
  mapsEmbed: 'https://www.google.com/maps?q=Carrera+15+15-72,+Riohacha,+La+Guajira&z=17&output=embed',
  payments: ['Efectivo', 'Nequi', 'Daviplata', 'Transferencia', 'Tarjeta'], // ⚠️ confirmar (destacado "Métodos de pago")
};

export const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`);

// Abre WhatsApp con el mensaje. Si no hay número, abre el enlace del perfil y copia el texto.
export async function sendWhatsApp(text) {
  if (CONFIG.phone) {
    window.open(`https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return 'sent';
  }
  try { await navigator.clipboard.writeText(text); } catch { /* sin portapapeles */ }
  window.open(CONFIG.waMessage, '_blank', 'noopener');
  return 'copied';
}

// Fotos reales (de su Instagram)
export const L = {
  salon: '/images/local/salon.jpg', lobby: '/images/local/lobby.jpg', fade: '/images/local/fade.jpg', facial: '/images/local/facial.jpg',
  spa: '/images/local/spa.jpg', ninos: '/images/local/ninos.jpg', textura1: '/images/local/textura1.jpg', textura2: '/images/local/textura2.jpg',
  detalle: '/images/local/detalle.jpg', tijeras: '/images/local/tijeras.jpg',
};

// ⚠️ Horario de referencia (destacado "Horarios"). 0 = domingo. [apertura, cierre] en minutos.
export const HOURS = { 0: [540, 840], 1: [540, 1200], 2: [540, 1200], 3: [540, 1200], 4: [540, 1200], 5: [540, 1230], 6: [540, 1230] };

// Experiencias (de su biografía: cortes • barba • facial • spa masculino, + uñas y niños)
export const EXPERIENCES = [
  { id: 'cortes', n: 'Cortes', t: 'Cortes con actitud', d: 'Fades, taper, clásicos y tendencias. Un corte pensado para tu cara y tu estilo.', img: L.fade, from: 25000 },
  { id: 'barba', n: 'Barba', t: 'Barba de caballero', d: 'Perfilado a navaja, toalla caliente y aceites. La barba que siempre quisiste.', img: L.detalle, from: 18000 },
  { id: 'facial', n: 'Facial', t: 'Facial con vapor', d: 'Limpieza profunda con vapor de ozono, exfoliación y mascarilla.', img: L.facial, from: 40000 },
  { id: 'spa', n: 'Spa masculino', t: 'Spa para hombres', d: 'Masaje con piedras calientes para soltar el estrés de la semana.', img: L.spa, from: 60000 },
  { id: 'ninos', n: 'Pequeños', t: 'Cariño para pequeños', d: 'Paciencia, juego y cortes de moda para los más pequeños de la casa.', img: L.ninos, from: 20000 },
  { id: 'unas', n: 'Uñas', t: 'Manos impecables', d: 'Manicure masculino: limpieza, corte y pulido para unas manos cuidadas.', img: '1604654894610-df63bc536371', from: 18000 },
];

// Servicios y precios. ⚠️ TODOS son de referencia: reemplazar por los reales.
export const SERVICES = [
  { id: 'corte', cat: 'cortes', n: 'Corte VIP', d: 'Lavado, corte y peinado', price: 25000, min: 45 },
  { id: 'corte-barba', cat: 'cortes', n: 'Corte + barba', d: 'El combo completo', price: 35000, min: 60, star: true },
  { id: 'barba', cat: 'barba', n: 'Barba con toalla caliente', d: 'Perfilado a navaja', price: 18000, min: 30 },
  { id: 'cejas', cat: 'barba', n: 'Cejas y contornos', d: 'Limpieza de cejas y nuca', price: 8000, min: 15 },
  { id: 'facial', cat: 'facial', n: 'Facial con vapor de ozono', d: 'Limpieza profunda y mascarilla', price: 40000, min: 40 },
  { id: 'spa', cat: 'spa', n: 'Masaje con piedras calientes', d: 'Espalda y cuello', price: 60000, min: 50 },
  { id: 'ninos', cat: 'ninos', n: 'Corte para pequeños', d: 'Con toda la paciencia del mundo', price: 20000, min: 35 },
  { id: 'unas', cat: 'unas', n: 'Manicure masculino', d: 'Limpieza, corte y pulido', price: 18000, min: 30 },
];

// El ritual VIP (sección fija)
export const RITUAL = [
  { t: 'Bienvenida', d: 'Te recibimos en nuestra sala lounge, con sofás de cuero y buena música.', img: L.lobby },
  { t: 'Tu estilo', d: 'Conversamos: tu cara, tu cabello y cómo quieres verte.', img: L.salon },
  { t: 'Precisión', d: 'Cortes con actitud: cada línea en su lugar.', img: L.fade },
  { t: 'Detalle', d: 'Barba, contornos y textura. Lo que hace la diferencia.', img: L.textura2 },
  { t: 'Relax', d: 'Vapor de ozono, facial y masaje con piedras calientes.', img: L.spa },
];

// Muro de fotos que se arrastra
export const WALL = [L.salon, L.fade, L.lobby, L.facial, L.spa, L.ninos, L.textura1, L.detalle, L.textura2, L.tijeras];

export const BARBERS = ['El primero disponible', 'Ya tengo mi barbero de confianza'];
