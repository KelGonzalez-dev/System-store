// ============================================================
// 88 BURGER · CÚCUTA — "Sabores Premium" · Servicio a domicilio
// Lo marcado con ⚠️ hay que confirmarlo con el dueño.
// ============================================================

export const CONFIG = {
  nombre: '88 Burger',
  ciudad: 'Cúcuta',
  // ⚠️ Número de WhatsApp: en la captura del Instagram se lee borroso (wa.me/c/57313…). Confirmar.
  whatsapp: '573132866394',
  instagram: '88burgercucuta',
  // ⚠️ Dirección del local (no aparece en las capturas)
  direccion: '',
  seguidores: '13,8 mil',
  publicaciones: 455,
  pagos: ['Efectivo', 'Nequi', 'Daviplata', 'Transferencia'], // ⚠️ confirmar
};

// ⚠️ Horario: en el Instagram dice "4:00 pm a 1…". Se asume 4:00 p. m. – 1:00 a. m. todos los días.
// Formato: [apertura, cierre] en minutos desde la medianoche; si cierra después de medianoche, cierre > 1440.
export const HORARIO = { 0: [960, 1500], 1: [960, 1500], 2: [960, 1500], 3: [960, 1500], 4: [960, 1500], 5: [960, 1500], 6: [960, 1500] };

export const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`;
export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`);
export const waLink = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

// Fotos de referencia (Unsplash). Para usar las fotos reales del negocio: guárdalas en
// public/images/menu/ y cambia "foto" por '/images/menu/nombre.jpg'. Si una foto no carga,
// se muestra una ilustración del plato.
const F = {
  b1: '1568901346375-23c9450c58cd', b2: '1550547660-d9450f859349', b3: '1571091718767-18b5b1457add',
  b4: '1553979459-d2229ba7433b', b5: '1586190848861-99aa4a171e90', b6: '1594212699903-ec8a3eca50f5',
  h1: '1612392062798-2dbaa2c6c99a', h2: '1619740455993-9e612b1af08a', h3: '1541214113241-21578d2d9b62',
  p1: '1573080496219-bb080dd4f877', p2: '1576107232684-1279f390859f', p3: '1630384060421-cb20d0e0649d',
  g1: '1555939594-58d7cb561ad1', g2: '1544025162-d76694265947',
  m1: '1572490122747-3968b75cc699', m2: '1579954115545-a95591f28bfc', d1: '1622483767028-3f66f32aef97', d2: '1621263764928-df1444c5e859',
};

export const CATEGORIAS = [
  { id: 'burgers', nombre: 'Hamburguesas', icono: 'burger', lema: 'Carne 100 % res, pan brioche y queso que se derrite.' },
  { id: 'perros', nombre: 'Perros', icono: 'hotdog', lema: 'Salchicha premium, toppings sin miedo.' },
  { id: 'salchipapas', nombre: 'Salchipapas', icono: 'fries', lema: 'Papa crocante, carnes y salsas de la casa.' },
  { id: 'picadas', nombre: 'Picadas', icono: 'picada', lema: 'Para compartir… o no.' },
  { id: 'papas', nombre: 'Papas y extras', icono: 'fries', lema: 'El acompañante perfecto.' },
  { id: 'bebidas', nombre: 'Bebidas', icono: 'shake', lema: 'Malteadas cremosas y bebidas bien frías.' },
];

// ⚠️ MENÚ DE EJEMPLO con precios de referencia: reemplazar por el menú real del negocio.
export const MENU = [
  // Hamburguesas
  { id: 'avalancha', cat: 'burgers', nombre: 'Avalancha de Queso', desc: 'Doble carne de res, cascada de salsa de queso cheddar, tocineta crocante picada y papas a la francesa.', precio: 36000, foto: F.b5, arte: 'burger', estrella: true, etiquetas: ['La más pedida'] },
  { id: 'doble-cheddar', cat: 'burgers', nombre: '88 Doble Cheddar', desc: 'Dos carnes de 150 g, doble cheddar fundido, tocineta, cebolla caramelizada y salsa 88.', precio: 32000, foto: F.b2, arte: 'burger', etiquetas: ['Premium'] },
  { id: 'clasica', cat: 'burgers', nombre: '88 Clásica', desc: 'Carne de res de 150 g, queso cheddar, lechuga, tomate, cebolla y salsa de la casa.', precio: 22000, foto: F.b1, arte: 'burger' },
  { id: 'bbq-crispy', cat: 'burgers', nombre: 'BBQ Crispy', desc: 'Carne de res, aros de cebolla crocantes, tocineta, queso y salsa BBQ ahumada.', precio: 30000, foto: F.b4, arte: 'burger' },
  { id: 'pollo-crispy', cat: 'burgers', nombre: 'Pollo Crispy', desc: 'Pechuga apanada crocante, queso, lechuga, tomate y mayonesa de ajo.', precio: 26000, foto: F.b3, arte: 'burger' },
  { id: 'mixta', cat: 'burgers', nombre: 'La Mixta 88', desc: 'Carne de res y pechuga de pollo, queso doble, tocineta y huevo.', precio: 34000, foto: F.b6, arte: 'burger', etiquetas: ['Para valientes'] },
  // Perros
  { id: 'perro-88', cat: 'perros', nombre: 'Perro 88', desc: 'Salchicha americana, queso gratinado, papita triturada, cebolla y salsas de la casa.', precio: 18000, foto: F.h1, arte: 'hotdog', estrella: true },
  { id: 'perro-tocineta', cat: 'perros', nombre: 'Perro Tocineta', desc: 'Salchicha envuelta en tocineta, queso fundido, maíz tierno y papita.', precio: 22000, foto: F.h2, arte: 'hotdog', etiquetas: ['Favorito'] },
  { id: 'perro-gratinado', cat: 'perros', nombre: 'Perro Gratinado', desc: 'Salchicha premium bañada en queso mozzarella gratinado y tocineta.', precio: 24000, foto: F.h3, arte: 'hotdog' },
  { id: 'mini-perrito', cat: 'perros', nombre: 'Mini Perrito', desc: 'La versión pequeña del Perro 88, perfecta para los niños o para picar.', precio: 10000, foto: F.h1, arte: 'hotdog' },
  // Salchipapas
  { id: 'salchipapa-88', cat: 'salchipapas', nombre: 'Salchipapa 88', desc: 'Papa a la francesa, salchicha, pollo desmechado, carne, tocineta, maíz y queso gratinado.', precio: 30000, foto: F.p3, arte: 'salchipapa', estrella: true, etiquetas: ['Para compartir'] },
  { id: 'salchipapa-aguacate', cat: 'salchipapas', nombre: 'Salchipapa con Aguacate', desc: 'Nuestra salchipapa cargada con aguacate fresco, queso y salsas de la casa.', precio: 32000, foto: F.p1, arte: 'salchipapa' },
  { id: 'salchipapa-clasica', cat: 'salchipapas', nombre: 'Salchipapa Clásica', desc: 'Papa crocante, salchicha americana, queso y salsas.', precio: 16000, foto: F.p2, arte: 'salchipapa' },
  // Picadas
  { id: 'picada-2', cat: 'picadas', nombre: 'Picada 88 para 2', desc: 'Carne de res, cerdo, chorizo, pollo, papa criolla, papa francesa, maduro y arepitas.', precio: 58000, foto: F.g1, arte: 'picada', estrella: true },
  { id: 'picada-4', cat: 'picadas', nombre: 'Picada Familiar (4)', desc: 'La picada 88 en tamaño familiar, con todas las carnes y acompañamientos.', precio: 98000, foto: F.g2, arte: 'picada', etiquetas: ['Familiar'] },
  // Papas y extras
  { id: 'papas-queso', cat: 'papas', nombre: 'Papas Queso y Tocineta', desc: 'Papas a la francesa bañadas en salsa de queso cheddar y tocineta crocante.', precio: 18000, foto: F.p3, arte: 'fries', estrella: true },
  { id: 'papas-francesa', cat: 'papas', nombre: 'Papas a la Francesa', desc: 'Porción de papas crocantes con sal.', precio: 8000, foto: F.p1, arte: 'fries' },
  { id: 'aros', cat: 'papas', nombre: 'Aros de Cebolla', desc: 'Aros de cebolla apanados y crocantes con salsa de la casa.', precio: 10000, foto: F.p2, arte: 'fries' },
  // Bebidas
  { id: 'malteada', cat: 'bebidas', nombre: 'Malteada 88', desc: 'Vainilla, fresa, chocolate u Oreo, con crema batida.', precio: 14000, foto: F.m1, arte: 'shake', estrella: true },
  { id: 'malteada-especial', cat: 'bebidas', nombre: 'Malteada Especial', desc: 'Con galleta, salsa de caramelo y chispas de chocolate.', precio: 17000, foto: F.m2, arte: 'shake' },
  { id: 'limonada', cat: 'bebidas', nombre: 'Limonada de Coco', desc: 'Limonada cremosa de coco, bien fría.', precio: 9000, foto: F.d2, arte: 'drink' },
  { id: 'gaseosa', cat: 'bebidas', nombre: 'Gaseosa', desc: 'Personal 400 ml.', precio: 4500, foto: F.d1, arte: 'drink' },
];

// Adiciones (se pueden elegir en hamburguesas, perros y salchipapas) ⚠️ precios de referencia
export const ADICIONES = [
  { id: 'queso', nombre: 'Queso extra', precio: 3000 },
  { id: 'tocineta', nombre: 'Tocineta', precio: 4000 },
  { id: 'carne', nombre: 'Carne extra', precio: 8000 },
  { id: 'huevo', nombre: 'Huevo', precio: 2000 },
  { id: 'papas', nombre: 'Papas a la francesa', precio: 6000 },
];
export const CON_ADICIONES = ['burgers', 'perros', 'salchipapas'];

// Galería (fotos de referencia: reemplazar por fotos reales del Instagram)
export const GALERIA = [F.b5, F.p3, F.b2, F.h2, F.g1, F.b1, F.m1, F.b4, F.p1, F.h1, F.b3, F.g2];
