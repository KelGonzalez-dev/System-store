// ============================================================
// CARTA — edita aquí platos, precios (COP) y fotos.
// Textos: [español, inglés]. Platos y precios de REFERENCIA:
// reemplázalos por los reales de Quile Parrilla.
// Fotos: id de Unsplash o ruta local '/images/local/...'.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales de Quile (de su Instagram y Google; baja resolución).
// Reemplázalas por las originales con el mismo nombre en /public/images/local/.
export const L = {
  espada: '/images/local/espada.jpg',
  picada: '/images/local/picada.jpg',
  pincho: '/images/local/pincho.jpg',
  costillas: '/images/local/costillas.jpg',
  carne: '/images/local/carne-salsa.jpg',
  mazorcada: '/images/local/mazorcada.jpg',
  salchipapa: '/images/local/salchipapa.jpg',
  salchipapa2: '/images/local/salchipapa2.jpg',
  gratinada: '/images/local/salchipapa-gratinada.jpg',
  salchiquiloca: '/images/local/salchiquiloca.jpg',
  nachos: '/images/local/nachos.jpg',
  vino: '/images/local/vino.jpg',
  ambiente: '/images/local/ambiente.jpg',
  interior: '/images/local/interior.jpg',
  parrillero: '/images/local/parrillero.jpg',
  logo: '/images/local/logo-blanco.jpg',
};

export const CATS = ['parrilla', 'compartir', 'salchipapas', 'hamburguesas', 'mazorcadas', 'entradas', 'bebidas'];

// f: c = favorito, s = picante · p = personas (para compartir)
const M = (id, cat, img, n, d, price, f = '', p = 0) => ({ id, cat, img, n, d, price, fav: f.includes('c'), hot: f.includes('s'), people: p });
const S = (x) => [x, x];

export const MENU = [
  // ---------- Parrilla
  M(1, 'parrilla', '1600891964092-4316c288032e', ['Churrasco 300 g', 'Churrasco 300 g'],
    ['Corte de res al carbón con papa a la francesa, ensalada y chimichurri', 'Charcoal-grilled beef with fries, salad and chimichurri'], 42000, 'c'),
  M(2, 'parrilla', L.carne, ['Punta de anca', 'Picanha'],
    ['Jugosa y dorada a la brasa, con papa criolla y arepa', 'Juicy and golden on the grill, with creole potatoes and arepa'], 44000, 'c'),
  M(3, 'parrilla', '1558030006-450675393462', ['Lomo de res', 'Beef tenderloin'],
    ['Medallón de lomo con salsa de la casa y papas', 'Tenderloin medallion with house sauce and fries'], 40000),
  M(4, 'parrilla', L.costillas, ['Costillas BBQ', 'BBQ ribs'],
    ['Costillas de cerdo glaseadas en BBQ, con papas y ensalada', 'Pork ribs glazed in BBQ, with fries and salad'], 38000),
  M(5, 'parrilla', '1532550907401-a500c9a57435', ['Pechuga a la parrilla', 'Grilled chicken breast'],
    ['Pechuga marinada a las finas hierbas, papas y ensalada', 'Herb-marinated chicken breast, fries and salad'], 32000),
  M(6, 'parrilla', L.pincho, ['Mixto parrillero', 'Mixed grill'],
    ['Res, cerdo, pollo y chorizo con papa, yuca y arepa', 'Beef, pork, chicken and chorizo with fries, yuca and arepa'], 48000, 'c'),

  // ---------- Para compartir
  M(7, 'compartir', L.espada, ['Espada Quile', 'Quile skewer'],
    ['El pincho gigante de la casa: chorizo, res, cerdo y pollo, servido en la mesa con papas', 'The giant house skewer: chorizo, beef, pork and chicken, served at the table with fries'], 120000, 'c', 4),
  M(8, 'compartir', L.picada, ['Picada Quile', 'Quile platter'],
    ['Carnes a la brasa, chorizo, morcilla, papa criolla, yuca y patacón', 'Grilled meats, chorizo, blood sausage, creole potatoes, yuca and plantain'], 85000, '', 3),
  M(9, 'compartir', L.parrillero, ['Picada familiar', 'Family platter'],
    ['Para toda la mesa: el doble de carnes, papas, patacones y salsas', 'For the whole table: double the meats, fries, plantains and sauces'], 140000, '', 6),

  // ---------- Salchipapas (los tamaños de la casa)
  M(10, 'salchipapas', L.salchipapa, ['Salchipapa personal', 'Personal salchipapa'],
    ['Papa a la francesa, salchicha, queso rallado y salsas', 'French fries, sausage, grated cheese and sauces'], 18000, '', 1),
  M(11, 'salchipapas', L.gratinada, ['Salchipapa gratinada', 'Gratinated salchipapa'],
    ['Bañada en queso gratinado con maíz tierno', 'Topped with melted cheese and sweet corn'], 28000, '', 2),
  M(12, 'salchipapas', L.salchiquiloca, ['Salchiquiloca', 'Salchiquiloca'],
    ['La loca de la casa: pollo, carne, chorizo, tocineta, maíz y queso', 'The crazy one: chicken, beef, chorizo, bacon, corn and cheese'], 32000, 'c', 2),
  M(13, 'salchipapas', L.salchipapa2, ['Salchiguajira', 'Salchiguajira'],
    ['Con carne desmechada, suero costeño y queso', 'With shredded beef, Colombian sour cream and cheese'], 30000, '', 2),
  M(14, 'salchipapas', L.salchipapa, ['Tronco de salchipapa', 'Salchipapa log'],
    ['Para compartir entre dos o tres', 'To share between two or three'], 45000, '', 3),
  M(15, 'salchipapas', L.salchipapa2, ['Salchipapa tipo burro', 'Donkey-size salchipapa'],
    ['Grande de verdad: para cuatro o cinco personas', 'Seriously big: for four or five people'], 85000, '', 5),
  M(16, 'salchipapas', L.gratinada, ['Salchipapa tipo elefante', 'Elephant-size salchipapa'],
    ['Para seis a ocho personas', 'For six to eight people'], 110000, '', 8),
  M(17, 'salchipapas', L.salchiquiloca, ['Salchipapa tipo ballena', 'Whale-size salchipapa'],
    ['La leyenda de Quile: para ocho a diez personas', 'The Quile legend: for eight to ten people'], 140000, 'c', 10),

  // ---------- Hamburguesas
  M(18, 'hamburguesas', '1568901346375-23c9450c58cd', ['Hamburguesa Quile', 'Quile burger'],
    ['Doble carne a la parrilla, tocineta, queso y salsas, con papas', 'Double grilled patty, bacon, cheese and sauces, with fries'], 28000, 'c'),
  M(19, 'hamburguesas', '1553979459-d2229ba7433b', ['Americana', 'American'],
    ['Carne a la parrilla, queso, lechuga y tomate, con papas', 'Grilled patty, cheese, lettuce and tomato, with fries'], 22000),
  M(20, 'hamburguesas', '1550547660-d9450f859349', ['De pollo', 'Chicken burger'],
    ['Pechuga a la parrilla, queso y salsa de la casa, con papas', 'Grilled chicken breast, cheese and house sauce, with fries'], 22000),
  M(21, 'hamburguesas', '1586190848861-99aa4a171e90', ['Gratinada', 'Gratinated'],
    ['Con queso gratinado y maíz tierno, con papas', 'With melted cheese and sweet corn, with fries'], 26000),

  // ---------- Mazorcadas
  M(22, 'mazorcadas', L.mazorcada, ['Mazorcada sencilla', 'Classic mazorcada'],
    ['Maíz tierno, queso gratinado, papa ripio y salsas', 'Sweet corn, melted cheese, potato sticks and sauces'], 24000),
  M(23, 'mazorcadas', L.mazorcada, ['Mazorcada mixta', 'Mixed mazorcada'],
    ['Con pollo, carne y chorizo bajo el queso gratinado', 'With chicken, beef and chorizo under melted cheese'], 30000, 'c'),

  // ---------- Entradas
  M(24, 'entradas', L.nachos, ['Nachos Quile', 'Quile nachos'],
    ['Tostadas de maíz, carne, suero costeño, guacamole y salsa cheddar', 'Corn chips, beef, Colombian sour cream, guacamole and cheddar'], 26000, 's'),
  M(25, 'entradas', '1555939594-58d7cb561ad1', ['Chorizo con arepa', 'Chorizo with arepa'],
    ['Chorizo a la brasa con arepa y limón', 'Grilled chorizo with arepa and lime'], 12000),
  M(26, 'entradas', '1573080496219-bb080dd4f877', ['Papas a la francesa', 'French fries'],
    ['Porción crocante con salsas de la casa', 'Crispy portion with house sauces'], 9000),

  // ---------- Bebidas
  M(27, 'bebidas', '1600271886742-f049cd451bba', ['Limonada de coco', 'Coconut lemonade'],
    ['Cremosa y bien fría', 'Creamy and ice cold'], 12000, 'c'),
  M(28, 'bebidas', '1556679343-c7306c1976bc', ['Limonada natural', 'Fresh lemonade'],
    ['Clásica o de hierbabuena', 'Classic or mint'], 8000),
  M(29, 'bebidas', '1535958636474-b021ee887b13', ['Cerveza nacional', 'Local beer'],
    ['Bien fría', 'Ice cold'], 6000),
  M(30, 'bebidas', L.vino, ['Copa de vino', 'Glass of wine'],
    ['Tinto de la casa', 'House red'], 18000),
];

// Los 3 platos para compartir (sección destacada)
export const SHARE_IDS = [7, 8, 17];

// Selector de salchipapa según personas
export const SIZES = [
  { id: 10, max: 1 }, { id: 11, max: 2 }, { id: 14, max: 3 }, { id: 15, max: 5 }, { id: 16, max: 8 }, { id: 17, max: 10 },
];

// Mosaico tipo Instagram
export const FEED = [L.espada, L.salchiquiloca, L.ambiente, L.mazorcada, L.costillas, L.nachos, L.pincho, L.gratinada, L.vino, L.carne, L.parrillero, L.salchipapa2];
