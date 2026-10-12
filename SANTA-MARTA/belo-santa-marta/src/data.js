// ============================================================
// BELO — carta y galería. Textos: [español, inglés].
// real: true  = plato y precio tomados de su carta digital (belo.cluvi.co).
// real: false = REFERENCIA de ejemplo: reemplázalo por el plato y precio real.
// Fotos: id de Unsplash o ruta local '/images/local/...'.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales (de su Instagram y carta, baja resolución): reemplázalas por las originales con el mismo nombre
export const L = {
  banner: '/images/local/banner.jpg',
  salon: '/images/local/salon.jpg',
  salon2: '/images/local/salon2.jpg',
  barraOro: '/images/local/barra-oro.jpg',
  barraBelo: '/images/local/barra-belo.jpg',
  nocheBar: '/images/local/noche-bar.jpg',
  rooftop: '/images/local/rooftop.jpg',
  cumple: '/images/local/cumple.jpg',
  calle: '/images/local/calle.jpg',
};

export const CATS = ['entradas', 'fuertes', 'lunch', 'postres', 'licores', 'cocteles', 'bebidas', 'vinos'];

const M = (id, cat, img, n, d, price, real = false, isNew = false) => ({ id, cat, img, n, d, price, real, isNew });
const S = (x) => [x, x];

export const MENU = [
  // ---------- Entradas
  M(1, 'entradas', '1608897013039-887f21d8c804', ['Burrata Divina', 'Burrata Divina'],
    ['Burrata crocante de búfala sobre mermelada de tomates cherry, pesto y tejas de parmesano', 'Crispy buffalo burrata over cherry tomato jam, pesto and parmesan crisps'], 48000, true, true),
  M(2, 'entradas', '1615141982883-c7ad0e69fd62', ['Ensalada Mediterránea con Pulpo y Calamar', 'Mediterranean Salad with Octopus and Squid'],
    ['Pulpo a la parrilla y aros de calamar, mix verde, tomate confitado, berenjenas confitadas, alcachofas crocantes y reducción de balsámico', 'Grilled octopus and squid rings, greens, confit tomato, confit eggplant, crispy artichokes and balsamic reduction'], 42000, true, true),
  M(3, 'entradas', '1535140728325-a4d3707eee61', ['Ceviche caribeño', 'Caribbean ceviche'], ['Pesca del día, leche de tigre de coco y patacón', 'Catch of the day, coconut tiger’s milk and plantain chips'], 36000),
  M(4, 'entradas', '1541529086526-db283c563270', ['Croquetas de la casa', 'House croquettes'], ['Cremosas, con alioli de ajo asado', 'Creamy, with roasted garlic aioli'], 28000),

  // ---------- Fuertes
  M(5, 'fuertes', '1544025162-d76694265947', ['Pulpo a la brasa', 'Charcoal-grilled octopus'], ['Con papas rotas, pimentón de la Vera y aceite de oliva', 'With smashed potatoes, smoked paprika and olive oil'], 68000),
  M(6, 'fuertes', '1519708227418-c8fd9a32b7a2', ['Pesca del Caribe', 'Caribbean catch'], ['Filete del día con arroz de coco y salsa criolla', 'Fish of the day with coconut rice and creole sauce'], 58000),
  M(7, 'fuertes', '1534080564583-6be75777b70a', ['Paella marinera', 'Seafood paella'], ['Arroz bomba con mariscos del Caribe', 'Bomba rice with Caribbean seafood'], 72000),
  M(8, 'fuertes', '1558030006-450675393462', ['Lomo al vino tinto', 'Tenderloin in red wine'], ['Medallón de res con reducción de vino y puré rústico', 'Beef medallion with wine reduction and rustic mash'], 64000),
  M(9, 'fuertes', '1563379926898-05f4575a45d8', ['Pasta negra con mariscos', 'Squid-ink pasta with seafood'], ['Tinta de calamar, camarón y ajo confitado', 'Squid ink, shrimp and confit garlic'], 56000),

  // ---------- Lunch Day (lunes a viernes, 12:00–3:00 p. m.)
  M(10, 'lunch', '1547592180-85f173990554', ['Almuerzo del día', 'Lunch of the day'], ['Cocina de barrio con el estilo de BELO: sopa, principio, proteína y bebida. Lunes a viernes, 12:00 – 3:00 p. m.', 'Neighborhood cooking BELO style: soup, side, protein and drink. Monday to Friday, 12:00 – 3:00 p.m.'], 25000, true),

  // ---------- Postres
  M(11, 'postres', '1571877227200-a0d98ea607e9', ['Tiramisú', 'Tiramisu'], ['Clásico italiano con café de la Sierra Nevada', 'Italian classic with Sierra Nevada coffee'], 22000),
  M(12, 'postres', '1470124182917-cc6e71b22ecc', ['Crème brûlée de coco', 'Coconut crème brûlée'], ['Caramelizada al momento', 'Caramelized to order'], 20000),
  M(13, 'postres', '1533134242443-d4fd215305ad', ['Cheesecake de maracuyá', 'Passion fruit cheesecake'], ['Cremoso, con coulis de maracuyá', 'Creamy, with passion fruit coulis'], 20000),

  // ---------- Licores para compartir (carta real)
  M(14, 'licores', '1569529465841-dfecdab7503b', S('Don Julio Reposado'), ['Botella', 'Bottle'], 480000, true),
  M(15, 'licores', '1527281400683-1aae777175f8', S('Johnnie Walker Gold Label'), ['Botella', 'Bottle'], 500000, true),
  M(16, 'licores', '1527281400683-1aae777175f8', S('Macallan 12 años Triple Cask'), ['Botella', 'Bottle'], 550000, true),
  M(17, 'licores', '1569529465841-dfecdab7503b', S('Ron Zacapa 23 años'), ['Botella', 'Bottle'], 520000, true),

  // ---------- Cócteles de autor (carta real)
  M(18, 'cocteles', '1551538827-9c037cb4f32a', S('Belo de Luxe'), ['Tequila 1800 Silver, zumo de limón, hierbabuena, pepino, tónica y crema de agave', 'Tequila 1800 Silver, lime juice, mint, cucumber, tonic and agave cream'], 40000, true, true),
  M(19, 'cocteles', '1514362545857-3bc16c4c7d1b', S('Ilegal'), ['Mezcal Unión, sirope simple, zumo de limón y ron blanco', 'Mezcal Unión, simple syrup, lime juice and white rum'], 40000, true, true),
  M(20, 'cocteles', '1587223962930-cb7f31384c19', ['Caribe Spritz', 'Caribe Spritz'], ['Aperitivo, maracuyá y espumoso', 'Aperitivo, passion fruit and sparkling wine'], 36000),

  // ---------- Bebidas
  M(21, 'bebidas', '1556679343-c7306c1976bc', ['Limonada de coco', 'Coconut lemonade'], ['Cremosa y bien fría', 'Creamy and ice cold'], 14000),
  M(22, 'bebidas', '1600271886742-f049cd451bba', ['Jugos naturales', 'Fresh juices'], ['Frutas del Caribe', 'Caribbean fruits'], 12000),
  M(23, 'bebidas', '1548839140-29a749e1cf4d', ['Agua', 'Water'], ['Con o sin gas', 'Still or sparkling'], 7000),

  // ---------- Vinos
  M(24, 'vinos', '1510812431401-41d2bd2722f3', ['Copa de vino tinto', 'Glass of red wine'], ['Selección de la casa', 'House selection'], 28000),
  M(25, 'vinos', '1566754436893-98224ee05f86', ['Copa de vino blanco', 'Glass of white wine'], ['Fresco y frutal', 'Fresh and fruity'], 28000),
  M(26, 'vinos', '1553361371-9b22f78e8b1d', ['Botella de la casa', 'House bottle'], ['Tinto, blanco o rosado', 'Red, white or rosé'], 140000),
];

export const DISH_IDS = [1, 2, 5, 6];
export const COCKTAIL_IDS = [18, 19];
export const BOTTLE_IDS = [14, 15, 16, 17];

export const GALLERY = [
  { src: L.banner, t: ['La casa', 'The house'] },
  { src: L.barraOro, t: ['La barra dorada', 'The golden bar'] },
  { src: L.rooftop, t: ['Noches de rooftop', 'Rooftop nights'] },
  { src: L.salon, t: ['El salón', 'The dining room'] },
  { src: L.barraBelo, t: ['Brindis en BELO', 'Cheers at BELO'] },
  { src: L.calle, t: ['Centro Histórico', 'Historic Center'] },
  { src: L.nocheBar, t: ['Cuando cae la noche', 'When night falls'] },
  { src: L.salon2, t: ['Luz de la tarde', 'Afternoon light'] },
];
