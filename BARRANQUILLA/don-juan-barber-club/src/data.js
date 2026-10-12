// ============================================================
// DON JUAN BARBER CLUB · Barranquilla — "La barbería de los famosos"
// ------------------------------------------------------------
// Lo marcado con ⚠️ hay que confirmarlo con el cliente.
// ============================================================

export const CONFIG = {
  whatsapp: '573000000000', // ⚠️ número de reservas con 57 adelante, sin espacios
  instagram: 'donjuanbarberclub',
  followers: '47 mil',
};

export const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
export const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`);

// Fotos reales (de su Instagram)
export const L = {
  corteSede: '/images/local/corte-sede.jpg', clienteRisa: '/images/local/cliente-risa.jpg', fade: '/images/local/fade.jpg', capa: '/images/local/capa.jpg',
  jersey: '/images/local/jersey.jpg', barberoLocal: '/images/local/barbero-local.jpg', perfil: '/images/local/perfil.jpg', sonrisa: '/images/local/sonrisa.jpg',
  bar: '/images/local/bar.jpg', staff: '/images/local/staff.jpg', entrada: '/images/local/entrada.jpg', salon: '/images/local/salon.jpg',
  barberoSonrisa: '/images/local/barbero-sonrisa.jpg', arte: '/images/local/arte.jpg', neon1: '/images/local/neon1.jpg', neon2: '/images/local/neon2.jpg',
  clienteVerde: '/images/local/cliente-verde.jpg', futbol: '/images/local/futbol.jpg', musica: '/images/local/musica.jpg',
};

// Sedes (de su Instagram). ⚠️ Horarios de referencia: confirmar en el destacado "HORARIOS".
const H = { 0: [600, 1080], 1: [540, 1200], 2: [540, 1200], 3: [540, 1200], 4: [540, 1200], 5: [540, 1260], 6: [540, 1260] };
export const SEDES = [
  { id: 'viva', n: 'C.C. Viva Barranquilla', d: '3er piso · local 337A · zona de servicios', tag: 'Sede principal', img: L.salon, hours: H, maps: 'https://www.google.com/maps/search/?api=1&query=Don+Juan+Barber+Club+Centro+Comercial+Viva+Barranquilla' },
  { id: 'brazuca', n: 'C.C. Brazuca', d: 'Villa Campestre', tag: 'Villa Campestre', img: L.entrada, hours: H, maps: 'https://www.google.com/maps/search/?api=1&query=Don+Juan+Barber+Club+Centro+Comercial+Brazuca+Villa+Campestre' },
  { id: 'carolina', n: 'C.C. Villa Carolina', d: 'SAO · Villa Carolina', tag: 'Norte', img: L.corteSede, hours: H, maps: 'https://www.google.com/maps/search/?api=1&query=Don+Juan+Barber+Club+Villa+Carolina+Barranquilla' },
];

// Servicios. real: true = precio visto en sus publicaciones. Los demás son ⚠️ de referencia.
export const SERVICES = {
  el: [
    { id: 'corte', n: 'Corte', d: 'Corte a tu estilo: fade, French crop, clásico o tendencia, con lavado y peinado.', price: 29990, min: 45, real: true, img: L.fade },
    { id: 'corte-barba', n: 'Corte + barba', d: 'El combo Don Juan: corte, perfilado y arreglo de barba con toalla caliente.', price: 44990, min: 70, real: true, img: L.barberoSonrisa, star: true },
    { id: 'barba', n: 'Barba de autor', d: 'Perfilado a navaja, diseño y aceites para una barba impecable.', price: 22000, min: 30, img: L.perfil },
    { id: 'skincare', n: 'Skincare facial', d: 'Limpieza profunda, black mask y exfoliación para una piel de revista.', price: 45000, min: 40, img: L.clienteRisa },
    { id: 'cejas', n: 'Cejas y contornos', d: 'Retoque entre cortes: contornos, nuca y cejas.', price: 12000, min: 15, img: L.sonrisa },
    { id: 'color', n: 'Color y platinados', d: 'Tintes, platinados y mechas de fantasía.', price: 80000, min: 90, img: L.neon2 },
  ],
  ella: [
    { id: 'manicure', n: 'Manicure', d: 'En nuestra zona de uñas: limado, cutícula y esmaltado tradicional o semipermanente.', price: 30000, min: 45, img: '1604654894610-df63bc536371' },
    { id: 'pedicure', n: 'Pedicure spa', d: 'Sillón de pedicure, exfoliación, hidratación y esmaltado.', price: 40000, min: 60, img: '1519014816548-bf5fe059798b' },
    { id: 'unas', n: 'Uñas acrílicas / press on', d: 'Diseño a tu gusto: francés, nude, cromado o arte a mano.', price: 85000, min: 90, img: '1632345031435-8727f6897d53' },
    { id: 'depilacion', n: 'Depilación con cera', d: 'Cejas, bozo, axilas y más, con cera de alta calidad.', price: 18000, min: 20, img: '1570172619644-dfd03ed5d881' },
    { id: 'facial', n: 'Limpieza facial', d: 'Limpieza, extracción, mascarilla e hidratación.', price: 75000, min: 60, img: '1616394584738-fc6e612e71b9' },
    { id: 'cepillado', n: 'Lavado y cepillado', d: 'Brillo, volumen y un peinado que dura.', price: 35000, min: 45, img: '1560066984-138dadb4c035' },
  ],
};

// ⚠️ Equipo: cambiar por los nombres reales de los "Don Juanes" (destacado DON JUANES)
export const TEAM = [
  { id: 'any', n: 'El primero disponible', r: 'Te asignamos al barbero libre', img: L.staff },
  { id: 'master', n: 'Barbero master', r: 'Cortes de tendencia y diseño', img: L.barberoLocal },
  { id: 'unas', n: 'Manicurista', r: 'Manicure y pedicure', img: '1604654894610-df63bc536371' },
  { id: 'senior', n: 'Barbero senior', r: 'Fades y barbas', img: L.corteSede },
  { id: 'beauty', n: 'Especialista de belleza', r: 'Depilación y facial', img: L.capa },
];

// El bar del club (bebidas de cortesía y carta del bar). ⚠️ confirmar opciones.
export const BAR = [
  { n: 'Cerveza bien fría', d: 'Nacional o importada', icon: '🍺' },
  { n: 'Shot de bienvenida', d: 'Tequila o whisky para arrancar', icon: '🥃' },
  { n: 'Granizados', d: 'Café, limón, frutos rojos', icon: '🧊' },
  { n: 'Café de la casa', d: 'Espresso, americano o capuchino', icon: '☕' },
  { n: 'Gaseosa o agua', d: 'Para refrescarte', icon: '🥤' },
  { n: 'Energizante', d: 'Para salir con todo', icon: '⚡' },
];

// Recorrido 3D "Entra al club"
export const WALK = [
  { img: L.entrada, t: 'Bienvenido al club', s: 'Pasa, la casa invita' },
  { img: L.neon2, t: 'Neón, plantas y estilo', s: 'Un lugar para quedarse' },
  { img: L.barberoSonrisa, t: 'Barberos de élite', s: 'Precisión en cada línea' },
  { img: L.bar, t: 'El bar', s: 'Cerveza, shots y granizados' },
  { img: L.futbol, t: 'Fútbol en pantalla', s: 'Nunca te pierdes el partido' },
  { img: L.musica, t: 'Música en vivo', s: 'Noches de Social Club' },
  { img: L.clienteRisa, t: 'La barbería de los famosos', s: 'Aquí se cortan las estrellas' },
];

// Muro de la fama (fotos reales de su Instagram)
export const FAME = [L.capa, L.perfil, L.jersey, L.clienteRisa, L.sonrisa, L.neon1, L.clienteVerde, L.fade, L.staff, L.barberoLocal, L.arte, L.neon2];

// ============================================================
// NUEVO: el club completo
// ============================================================
export const STATS = [
  { n: 25, s: '', l: 'barberos profesionales' },
  { n: 3, s: '', l: 'sedes en Barranquilla' },
  { n: 47, s: 'K', l: 'seguidores en Instagram' },
  { n: 1, s: '', l: 'bebida de cortesía' },
];

// Escenas del hero (fotos reales, pasan solas con efecto cine)
export const HERO_SLIDES = [L.salon, L.barberoSonrisa, L.neon2, L.bar, L.corteSede];

// Zonas del club (recorrido horizontal 3D)
export const ZONES = [
  { id: 'barberia', k: 'Barbería', t: '25 barberos profesionales', d: 'Fades, French crop, diseños, barba a navaja y toalla caliente. Cada silla con un profesional de verdad.', img: L.barberoSonrisa, icon: '✂' },
  { id: 'unas', k: 'Zona de uñas', t: 'Manicure & pedicure', d: 'Un espacio aparte, cómodo y tranquilo para manos y pies: tradicional, semipermanente, acrílicas y spa.', img: '1604654894610-df63bc536371', icon: '💅' },
  { id: 'bar', k: 'El bar', t: 'Cerveza, ron, tequila y whisky', d: 'Tu primera bebida va por la casa. Después, la carta del bar para seguir la charla.', img: L.bar, icon: '🥃' },
  { id: 'snacks', k: 'Snacks', t: 'Algo para picar', d: 'Pasabocas y snacks para la espera, el partido o la previa.', img: '1599490659213-e2b9527bd087', icon: '🍿' },
  { id: 'pantallas', k: 'Entretenimiento', t: 'Pantallas en todo el club', d: 'Fútbol, partidos de la Selección y contenido en vivo mientras te atienden.', img: L.futbol, icon: '📺' },
  { id: 'tienda', k: 'Tienda', t: 'Productos para caballeros', d: 'Ceras, pomadas, aceites y shampoo profesional para mantener el corte en casa.', img: '1621607512214-68297480165e', icon: '🧴' },
];

// Bar: categorías de la carta (⚠️ confirmar marcas y opciones)
export const SHELF = [
  { id: 'cerveza', n: 'Cervezas', d: 'Nacionales e importadas, bien frías', color: '#e9a23b', items: ['Nacional', 'Importada', 'Michelada'] },
  { id: 'ron', n: 'Ron', d: 'Para brindar sin afán', color: '#9a4b1f', items: ['Ron añejo', 'Ron con cola', 'Shot'] },
  { id: 'tequila', n: 'Tequila', d: 'El shot de bienvenida', color: '#d9c27a', items: ['Shot con sal y limón', 'Tequila reposado'] },
  { id: 'whisky', n: 'Whisky', d: 'En las rocas o solo', color: '#b5651d', items: ['En las rocas', 'Con soda', 'Doble'] },
  { id: 'granizados', n: 'Granizados', d: 'Café, limón, frutos rojos', color: '#c94f7c', items: ['Café', 'Limón', 'Frutos rojos'] },
  { id: 'snacks', n: 'Snacks', d: 'Para picar mientras esperas', color: '#f5c443', items: ['Papas', 'Maní', 'Nachos'] },
];

// Tienda (⚠️ cambiar por los productos y precios reales que venden)
export const SHOP = [
  { id: 'pomada', n: 'Pomada de fijación media', d: 'Brillo natural, se lava fácil', price: 55000, kind: 'jar', c: '#c9a24a' },
  { id: 'cera', n: 'Cera mate', d: 'Fijación fuerte, acabado seco', price: 58000, kind: 'jar', c: '#3a3a3a' },
  { id: 'aceite', n: 'Aceite para barba', d: 'Suaviza y da brillo', price: 45000, kind: 'dropper', c: '#b5651d' },
  { id: 'shampoo', n: 'Shampoo diario', d: 'Limpieza profunda para todo tipo de cabello', price: 52000, kind: 'bottle', c: '#1e3a5f' },
  { id: 'after', n: 'After shave', d: 'Calma la piel después de afeitar', price: 48000, kind: 'flask', c: '#2f6d5a' },
  { id: 'polvo', n: 'Polvo texturizador', d: 'Volumen y textura al instante', price: 49000, kind: 'shaker', c: '#7a2e2e' },
];

// Bebidas de cortesía a elegir en la reserva
export const COURTESY = ['Cerveza', 'Shot de bienvenida', 'Granizado', 'Café', 'Agua o gaseosa'];

// Portadas "Don Juan Magazine" (fotos reales con titulares de revista)
export const COVERS = [
  { img: L.perfil, h: 'Barba de autor', s: 'El detalle que te cambia la cara' },
  { img: L.capa, h: 'Corte de famoso', s: 'Lo que piden las estrellas' },
  { img: L.sonrisa, h: 'Sonrisa Don Juan', s: 'Así se sale del club' },
  { img: L.neon1, h: 'La nueva generación', s: 'Cortes que marcan tendencia' },
  { img: L.clienteRisa, h: 'Buen ambiente', s: 'Una cerveza y una buena charla' },
  { img: L.fade, h: 'El fade perfecto', s: 'Precisión de 25 profesionales' },
  { img: L.clienteVerde, h: 'Estilo que se nota', s: 'Del sillón a la foto' },
  { img: L.neon2, h: 'Rizos con flow', s: 'Textura, forma y actitud' },
];
