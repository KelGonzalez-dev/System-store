// ============================================================
// GNAM DOLCE — CARTA REAL 2026 (tomada de su PDF "Carta final 2026").
// Cada categoría: id, grupo, nombre [es, en], nota (horario), fotos y platos [nombre, descripción, precio].
// Las descripciones se dejan como en su carta (español).
// Fotos: rutas locales (de su Instagram) o id de Unsplash.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

export const L = {
  desayuno: '/images/local/desayuno.jpg',
  panini: '/images/local/panini.jpg',
  costillas: '/images/local/costillas.jpg',
  tostada: '/images/local/tostada.jpg',
  brunch: '/images/local/brunch.jpg',
  malteadas: '/images/local/malteadas.jpg',
  pastas: '/images/local/pastas.jpg',
  torta: '/images/local/torta.jpg',
  postre: '/images/local/postre.jpg',
  fachada: '/images/local/fachada.jpg',
};

export const GROUPS = [
  { id: 'cafe', n: ['Café', 'Coffee'] },
  { id: 'brunch', n: ['Brunch', 'Brunch'] },
  { id: 'cocina', n: ['Cocina', 'Kitchen'] },
  { id: 'bebidas', n: ['Bebidas', 'Drinks'] },
  { id: 'dolce', n: ['Dolce', 'Dolce'] },
];

const C = (id, group, n, note, img, items) => ({ id, group, n, note, img, items });

export const CARTA = [
  C('calientes', 'cafe', ['Bebidas calientes', 'Hot drinks'], null, ['1461023058943-07fcbe16d735', '1510591509098-f4fdc6d0ff04', '1572442388796-11668a67e53d'], [
    ['Infusiones', '', 6900], ['Espresso / Americano', '', 7900], ['Espresso doble', '', 8900], ['Macchiato', '', 8900],
    ['Capuchino', '', 9900], ['Latte', '', 9900], ['Flat white', '', 10900], ['Mocca', '', 10900],
    ['Chocolate', '', 11900], ['Té chai', '', 12900], ['Té matcha', '', 13900],
  ]),
  C('adiciones', 'cafe', ['Adiciones', 'Add-ons'], null, ['1509042239860-f550ce710b93'], [
    ['Leche de almendras', '', 2500], ['Leche de avena', '', 2500], ['Arequipe', '', 3000],
    ['Leche condensada', '', 3000], ['Crema de whisky', '', 8000], ['Panna / chantilly', '', 8000],
  ]),
  C('frias-cafe', 'cafe', ['Bebidas frías con café', 'Iced coffee drinks'], null, ['1517701604599-bb29b565090c', '1461023058943-07fcbe16d735'], [
    ['Americano frío', '', 8900], ['Latte frío', '', 10900], ['Caramel iced latte', '', 14900],
    ['Tiramisú iced latte', '', 16900], ['Baileys iced latte', '', 19900], ['Nocciolata iced latte', '', 17900],
  ]),
  C('affogatos', 'cafe', ['Affogatos', 'Affogatos'], null, [L.postre], [
    ['Tradicional', 'Espresso doble, 150 g de nuestro gelato de tres leches.', 15900],
    ['Cioccolato', 'Espresso doble, 150 g de nuestro gelato de tartufo negro, cobertura de chocolate y panna.', 19900],
    ['Oro', 'Espresso doble, 150 g de nuestro gelato de arequipe variegato, arequipe y panna.', 21900],
  ]),

  C('desayuno', 'brunch', ['Desayuno / Brunch', 'Breakfast / Brunch'], ['9:00 a. m. – 2:00 p. m.', '9:00 a.m. – 2:00 p.m.'], [L.desayuno, L.tostada, L.brunch], [
    ['Desayuno campesino', 'Rebanadas de papa salteadas con aceite de oliva, cebolla, orégano, tocineta y huevos orgánicos.', 26900],
    ['Guacamole toast', 'Tostadas de pan de masa madre, chipotle de la casa, guacamole, huevos orgánicos y tocineta.', 28900],
    ['Pesto toast', 'Tostadas de pan de masa madre, pesto, lechuga romana, jamón de cerdo, mozzarella, tocineta y huevo frito.', 29900],
    ['Pommes', 'Papa francesa, pollo, salsa de la casa, tocineta, huevo frito y cebollín.', 30900],
    ['Cocotte criollo', 'Cuadritos de papa salteada, tocineta, chorizo, huevo frito, queso parmesano.', 30900],
    ['Cayeye', 'Mote de guineo verde, hogao, suero, queso costeño y chicharrón.', 32900],
    ['Club house', 'Pan brioche, queso crema con finas hierbas, lechuga, tomate, mozzarella, cheddar, tocineta y jamón.', 33900],
    ['Fit', 'Huevos al gusto, lomo fino, rebanadas de tomate y aguacate y pan masa madre.', 43900],
  ]),
  C('dulce-brunch', 'brunch', ['Brunch dulce', 'Sweet brunch'], ['9:00 a. m. – 2:00 p. m.', '9:00 a.m. – 2:00 p.m.'], [L.malteadas, L.desayuno], [
    ['Bowl de frutas', 'Frutas de temporada.', 22900],
    ['Granola parfait', 'Granola, avena, yogurt griego, fresas, arándanos, mango, miel y semillas de chía.', 30900],
    ['Pancakes tradicionales / avena y banano', 'Acompañados de fresas, banano, kiwi, arándanos y miel.', 30900],
    ['Dolce pancakes', 'Acompañados de banano, fresas, arándanos. Bañados con crema de avellanas y chocolate.', 32900],
    ['Tostadas francesas', 'Pan brioche sumergido en mezcla de huevo, leche y canela. Acompañado de fresas, arándanos, miel y chantilly.', 36900],
  ]),
  C('paninis', 'brunch', ['Paninis · pan ciabatta', 'Paninis · ciabatta'], ['9:00 a. m. – 2:00 p. m.', '9:00 a.m. – 2:00 p.m.'], [L.panini], [
    ['Homemade chicken', 'Rúgula, queso mozzarella, pechuga de pollo, pimentones verdes ahumados, tomate, tocineta, aguacate.', 34900],
    ['Roastbeef', 'Queso crema, lechuga, cebolla caramelizada, roastbeef, tocineta.', 35900],
    ['Colombiano', 'Salsa de pimentones ahumados, lechuga, tomate, cebolla blanca salteada, lomo fino, mix de quesos, aguacate y plátano maduro.', 36900],
    ['Caprese', 'Pesto, burrata, tomate, rúgula y jamón serrano.', 38900],
  ]),
  C('sandwiches', 'brunch', ['Sándwiches · pan francés', 'Sandwiches · French bread'], ['9:00 a. m. – 2:00 p. m.', '9:00 a.m. – 2:00 p.m.'], [L.panini, L.tostada], [
    ['Croque monsieur', 'Crema de quesos, mantequilla, queso emmental, jamón york.', 33900],
    ['Bondiola ahumada', 'Bondiola de cerdo marinada y ahumada al barril, cebolla salteada.', 35900],
    ['Brisket', 'Brisket ahumado, doble queso mozzarella, pepinillos y salsa de la casa.', 39900],
  ]),

  C('compartir', 'cocina', ['Para compartir', 'To share'], ['Todo el día', 'All day'], [L.brunch, '1541529086526-db283c563270'], [
    ['Volcanes de papa', 'Cuatro croquetas de puré de papa freídas, rellenas de queso mozzarella.', 26900],
    ['Empanadas de la casa · carne', 'Dos empanadas de harina de trigo rellenas.', 24900],
    ['Empanadas de la casa · camarón', 'Dos empanadas de harina de trigo rellenas.', 28900],
    ['Tostadas de champiñones', 'Salteados en ajo, crema de queso fundido y perejil.', 29900],
    ['Mini sandwiches', '2 mini sandwiches de pan brioche, pollo apanado, rúgula, queso mozzarella, salsa de la casa y miel.', 29900],
    ['Bruschetas de jamón serrano', 'Burrata, tomate, rúgula, jamón serrano y vinagre balsámico.', 30900],
    ['Croquetas al cayeye', 'Puré de plátano, lomo fino salteado. Acompañado con aderezo de suero.', 30900],
    ['Tostadas de salmón', 'Cuatro tostadas de pan de masa madre, guacamole, queso crema, salmón crudo, sazonado con limón, sal y pimienta.', 36900],
    ['Burrata', 'Tomates cherry, pesto, rúgula, vinagreta y burrata.', 42900],
  ]),
  C('pastas', 'cocina', ['Pastas', 'Pasta'], ['5:00 p. m. – 10:00 p. m.', '5:00 p.m. – 10:00 p.m.'], [L.pastas], [
    ['Al pesto', 'Espagueti, albahaca, perejil, aceite de oliva, ajo, pimienta.', 26900],
    ['Espaguetis a la boloñesa', 'Carne de res premium, molida y cocinada a fuego lento con verduras. Aromatizada con puré de tomate y vino blanco.', 38900],
    ['Alfredo', 'Fetuccine o espagueti en salsa a base de mantequilla, queso parmesano, crema de leche, pimienta negra, perejil, ajo, cebolla, pollo y tocineta.', 38900],
    ['Tagliatelle pomodoro', 'Fetuccini en salsa pomodoro, vino tinto, lomo fino, chorizo y verduras.', 40900],
    ['Rochet de la casa', 'Pasta penne en puré de tomate con crema de leche, tomates deshidratados y queso crema, pollo, tocineta, pimienta.', 42900],
    ['Fetuccini cremoso', 'Fetuccini en salsa de queso crema, parmesano y vino blanco, con langostinos adobados en ajo, sal, pimienta, tomate cherry y espinaca.', 49900],
    ['Marinera', 'Pasta de preferencia en salsa pomodoro, langostinos, camarones, pulpo, calamar y mejillones, salteados en aceite de oliva y vino blanco.', 58900],
  ]),
  C('lasanas', 'cocina', ['Lasañas', 'Lasagnas'], ['5:00 p. m. – 10:00 p. m.', '5:00 p.m. – 10:00 p.m.'], ['1574894709920-11b28e7367e3'], [
    ['Al pollo', 'Lasaña preparada con salsa ragú de pechuga de pollo desmenuzada. Gratinada con queso parmesano.', 37900],
    ['Fior di latte', 'Lasaña preparada con pollo en salsa tradicional bechamel. Gratinada con mozzarella y parmesano.', 38900],
    ['Bifurcata', 'Lasaña con salsa tradicional ragú de carne molida premium y pechuga de pollo desmenuzada. Gratinada con queso parmesano.', 39900],
    ['Della nonna', 'Lasaña con salsa tradicional ragú de carne molida premium. Gratinada con queso parmesano.', 40900],
    ['Di mare', 'Lasaña con camarones en salsa tradicional bechamel. Gratinada con mozzarella y parmesano.', 51900],
  ]),
  C('pizzetas', 'cocina', ['Pizzetas', 'Pizzettas'], ['5:00 p. m. – 10:00 p. m. · masa de 48 h · borde de queso $5.000', '5:00 p.m. – 10:00 p.m. · 48-hour dough · cheese crust $5,000'], ['1513104890138-7c749659a591', '1565299624946-b28f40a0ae38'], [
    ['Margarita', 'Salsa napolitana, tomate, albahaca, queso mozzarella, aceite de oliva.', 29900],
    ['Ananas', 'Salsa napolitana, piña, queso mozzarella y jamón de cerdo ahumado.', 32900],
    ['Pepperoni & salami', 'Salsa napolitana, pepperoni, salami, tocineta, queso mozzarella.', 36900],
    ['Carbonara', 'Salsa carbonara, guanciale, queso parmesano, queso mozzarella.', 36900],
    ['Cuatro quesos', 'Salsa carbonara, queso parmesano, queso mozzarella, queso azul.', 42900],
    ['Stracciatella & prosciutto', 'Salsa napolitana, queso mozzarella, prosciutto, pesto y burrata di bufala.', 46900],
    ['Brisket', 'Salsa napolitana, brisket, cebolla encurtida, cilantro, salsa perejil, queso mozzarella.', 48900],
    ['Frutos del mar', 'Salsa napolitana, anillos de calamar, pulpo, camarones, langostinos, mejillones, queso mozzarella.', 58900],
  ]),
  C('especiales', 'cocina', ['Especiales Gnam', 'Gnam specials'], ['5:00 p. m. – 10:00 p. m.', '5:00 p.m. – 10:00 p.m.'], [L.costillas, '1600891964092-4316c288032e', '1467003909585-2f8a72700288'], [
    ['Ensalada de la casa · pollo', 'Lechuga, rúgula, zanahoria, aguacate, cebolla encurtida, tomate cherry, tocineta, queso parmesano, aceitunas y vinagreta de la casa.', 36900],
    ['Ensalada de la casa · lomo fino', 'Lechuga, rúgula, zanahoria, aguacate, cebolla encurtida, tomate cherry, tocineta, queso parmesano, aceitunas y vinagreta de la casa.', 39900],
    ['Ensalada de la casa · camarones', 'Lechuga, rúgula, zanahoria, aguacate, cebolla encurtida, tomate cherry, tocineta, queso parmesano, aceitunas y vinagreta de la casa.', 41900],
    ['Ensalada de la casa · salmón ahumado', 'Lechuga, rúgula, zanahoria, aguacate, cebolla encurtida, tomate cherry, tocineta, queso parmesano, aceitunas y vinagreta de la casa.', 44900],
    ['Pollo a la parrilla', 'Jugosa pechuga de pollo grillada con finas hierbas, acompañada de papas rústicas asadas y ensalada de la casa.', 44900],
    ['Costillas ahumadas', '400 g de jugosas costillas de cerdo marinadas y glaseadas con una mezcla especial de sabores semidulces. Ligeramente picantes. Con papa a la francesa.', 55900],
    ['Punta gorda (400 g)', 'Con papa casco, papa francesa o puré de papa y ensalada.', 56000],
    ['Churrasco (400 g)', 'Con papa casco, papa francesa o puré de papa y ensalada.', 56000],
    ['Filet mignon (400 g)', 'Con papa casco, papa francesa o puré de papa y ensalada.', 59000],
    ['Lomo fino (400 g)', 'Con papa casco, papa francesa o puré de papa y ensalada.', 63000],
    ['Baby beef (400 g)', 'Con papa casco, papa francesa o puré de papa y ensalada.', 63000],
    ['Salmón toscano', 'Filete de salmón en sal, ajo y pimienta. Salteado en aceite de oliva y reducido en crema de leche, queso crema, vino tinto, tomates cherry y espinacas.', 59900],
    ['Risotto de la casa · pollo', 'Risotto reducido en crema de quesos, queso crema, vino blanco, salsa pomodoro y verduras.', 58900],
    ['Risotto de la casa · frutos del mar', 'Risotto reducido en crema de quesos, queso crema, vino blanco, salsa pomodoro y verduras.', 65900],
    ['Langostinos bravos', 'Seis langostinos montados sobre puré de papa, salteados con orégano, sal, ajo y pimienta, en aceite de oliva, salsa de tamarindo y pimienta roja.', 66900],
  ]),
  C('adicionales', 'cocina', ['Adicionales', 'Extras'], null, ['1512621776951-a57141f2eefd'], [
    ['Champiñones', '', 5000], ['Tocineta', '', 5000], ['Pollo', '', 10000], ['Lomo fino', '', 13000], ['Camarones', '', 15000],
  ]),
  C('infantil', 'cocina', ['Menú infantil', 'Kids menu'], null, ['1562967914-608f82629710', '1551183053-bf91a1d81141'], [
    ['Espagueti al burro', 'Pastas con mantequilla, sal, ajo, pimienta, pollo.', 27900],
    ['Deditos de pescado', 'Deditos de pescado apanados acompañados de papa francesa.', 28900],
    ['Nuggets de pollo', 'Nuggets de pollo apanado acompañados de papa francesa.', 29900],
    ['Club house kids', 'Pan de molde, pollo apanado, vegetales de preferencia, salsas de la casa y mix de quesos.', 29900],
    ['Boloñesa', 'Pasta de preferencia acompañada con salsa boloñesa.', 32900],
  ]),

  C('granizadas', 'bebidas', ['Granizadas', 'Slushies'], null, ['1546173159-315724a31696', '1556679343-c7306c1976bc'], [
    ['Limón', '', 9900], ['Sandía', '', 13900], ['Fresa', '', 14900], ['Hierbabuena', '', 13900], ['Mango', '', 13900],
    ['Tamarindo', '', 13900], ['Mora', '', 13900], ['Piña', '', 13900], ['Maracuyá', '', 14900], ['Corozo', '', 14900],
    ['Limonada de coco', '', 16900], ['Cerezada', '', 14900], ['Frutos rojos', '', 14900], ['Açaí', '', 17900],
  ]),
  C('smoothies', 'bebidas', ['Smoothies', 'Smoothies'], null, ['1505252585461-04db1eb84625'], [
    ['Mango · fresa · hierbabuena (agua)', '', 15900], ['Papaya · mango · banano (agua)', '', 16900],
    ['Fresa · banano (leche)', '', 16900], ['Piña · maracuyá · arándanos (agua)', '', 16900],
  ]),
  C('sodas', 'bebidas', ['Sodas', 'Sodas'], null, ['1556679343-c7306c1976bc'], [
    ['Limón', '', 10900], ['Mango', '', 15900], ['Tamarindo', '', 15900], ['Maracuyá', '', 17900], ['Frutos rojos', '', 17900],
    ['Corozo', '', 17900], ['Sandía · cereza', '', 16900], ['Frutos tropicales', '', 18900], ['Frutos verdes', '', 18900],
  ]),
  C('vinos', 'bebidas', ['Copa de vino', 'Glass of wine'], null, ['1510812431401-41d2bd2722f3'], [
    ['Merlot', '', 19900], ['Cabernet sauvignon', '', 19900], ['Sauvignon blanc', '', 19900], ['Malbec', '', 19900], ['Carmenere', '', 19900],
  ]),

  C('milkshakes', 'dolce', ['Milkshakes', 'Milkshakes'], ['Nuestro gelato batido con leche y chantilly', 'Our gelato blended with milk and whipped cream'], [L.malteadas], [
    ['Arequipe', '', 16900], ['Tres leches', '', 16900], ['Milo', '', 18900], ['Crema de maní', '', 18900], ['Maracuyá / maracumango', '', 18900],
    ['Brownie', '', 18900], ['Pie de limón', '', 19900], ['Alfajor', '', 18900], ['Banano / nocciolata', '', 19900], ['Panna cotta', '', 19900],
    ["Kinder's eis", '', 20900], ['Pistacho', '', 23900],
  ]),
  C('granizados-cremosos', 'dolce', ['Granizados cremosos', 'Creamy frappés'], ['Batidos con leche, hielo y chantilly', 'Blended with milk, ice and whipped cream'], [L.malteadas, '1572490122747-3968b75cc699'], [
    ['Café', '', 15900], ['Arequipe', '', 16900], ['Milo', '', 17900], ['Té chai', '', 17900], ['Fresa', '', 17900],
    ['Guanábana', '', 17900], ['Chocolate blanco', '', 18900], ['Nutella', '', 18900], ['Té matcha', '', 18900], ['Chocolate', '', 18900],
  ]),
  C('cocteles', 'dolce', ['Cócteles cremosos', 'Creamy cocktails'], null, ['1587223962930-cb7f31384c19'], [
    ['Piña colada', '', 25900], ['Vino tinto & gelato', '', 27900], ['Baileys', '', 28900],
  ]),
  C('bowls', 'dolce', ['Bowls de frutas', 'Fruit bowls'], ['Con gelato y panna', 'With gelato and panna'], ['1488477181946-6428a0291777'], [
    ['Sweet banana bowl', 'Bowl con rebanadas de banano, arequipe o nocciolata, 180 g de nuestro gelato y panna.', 22900],
    ["Emma's bowl", 'Bowl con banano y fresas rebanadas, salsa natural de fresa, 180 g de nuestro gelato y panna.', 23900],
    ['Bowl de la casa', 'Piña, mango, banano, fresa, melón, uva chilena y kiwi, salsa de maracuyá natural, leche condensada, 180 g de nuestro gelato y panna.', 26900],
  ]),
  C('fresas', 'dolce', ['Fresas con panna', 'Strawberries & cream'], null, [L.postre], [
    ['Fresas & gelato', 'Rebanadas de fresa, crema chantilly, salsa de fresa y 160 g de nuestro gelato de tres leches.', 24900],
    ['Fresas & panna', 'Rebanadas de fresa, crema chantilly, leche condensada y salsa de fresa.', 19900],
  ]),
  C('waffles', 'dolce', ['Waffles', 'Waffles'], ['Mezcla original de la casa / mezcla de pan de bono', 'House batter / pan de bono batter'], ['1562376552-0d160a2f238d'], [
    ['Banana bliss', 'Rebanadas de banano, arequipe / nocciolata, 160 g de nuestro gelato de tres leches y panna.', 25900],
    ['Gnam gnam', 'Rebanadas de fresa, banano, nocciolata / arequipe, 160 g de nuestro gelato de tres leches, salsa al gusto y panna.', 28900],
    ['Dolce fragola', 'Fresas, cobertura de chocolate negro / blanco, salsa al gusto, 160 g de nuestro gelato y panna.', 29900],
    ['Pistacella', 'Rebanadas de fresa, chocolate blanco, crema de pistachos, trozos de pistachos, gelato de pistacho.', 40900],
  ]),
  C('copas', 'dolce', ['Copas con gelato', 'Gelato sundaes'], ['Disponibles a partir de la 1:00 p. m.', 'Available from 1:00 p.m.'], [L.postre, L.malteadas, L.torta], [
    ['Cookies & gelato', 'Trozos de cookies, 180 g de nuestro gelato, salsas y toppings al gusto y panna.', 16900],
    ['Panna cotta', 'Salsa natural de frutos rojos, fresa, 180 g de nuestro gelato de tres leches, leche condensada y panna.', 22900],
    ['Brownie lovers', 'Trozos de brownie, cobertura de chocolate, salsa al gusto, 180 g de nuestro gelato de brownie y panna.', 21900],
    ['Clasic banana split', 'Rebanadas de banano, salsas al gusto, 180 g de nuestro gelato, chips de chocolate, trozos de galletas y panna.', 22900],
    ['Nueces', '200 g de gelato, macadamia, nuez pecan, nuez del Brasil, nuez de nogal, almendras, maní y pistachos, crema de pistacho y panna.', 26900],
    ['Pistacho crocante', '200 g de gelato, crema de pistacho elaborada con los mejores pistachos, panna.', 29900],
    ['Tropical', 'Melón, mango, piña, fresa, banano, kiwi, uvas y sandía, 160 g de nuestro gelato, salsa de maracuyá, mango o fresa y panna.', 30900],
    ["Kinder's eis", 'Trozos de chocolatina Kinder tradicional, Kinder Bueno, huevo Kinder, cobertura de chocolate de leche, 160 g de nuestro gelato y panna.', 32900],
  ]),
];

// Un día en Gnam (horario real: martes sin servicio)
export const DAY = [
  { at: '8:00', img: L.desayuno, cat: 'desayuno', picks: ['Guacamole toast', 'Cayeye', 'Dolce pancakes'] },
  { at: '1:00', img: L.malteadas, cat: 'copas', picks: ['Pistacho crocante', "Kinder's eis", 'Brownie lovers'] },
  { at: '5:00', img: L.pastas, cat: 'pastas', picks: ['Fetuccini cremoso', 'Marinera', 'Rochet de la casa'] },
  { at: '8:00', img: L.costillas, cat: 'especiales', picks: ['Costillas ahumadas', 'Langostinos bravos', 'Salmón toscano'] },
];

// Horario: 0 = domingo … 6 = sábado. Turnos en minutos desde la medianoche. Martes: sin servicio.
export const HOURS = { 0: [[480, 840], [1020, 1350]], 1: [[480, 840], [1020, 1350]], 2: null, 3: [[480, 840], [1020, 1350]], 4: [[480, 840], [1020, 1350]], 5: [[480, 840], [1020, 1350]], 6: [[480, 840], [1020, 1350]] };

// Sabores de gelato que aparecen en su carta (para "Arma tu copa")
export const FLAVORS = [
  { id: 'tres', n: ['Tres leches', 'Tres leches'], c: '#f4e6c8', copa: 'Panna cotta' },
  { id: 'tartufo', n: ['Tartufo negro', 'Black truffle'], c: '#4a2c20', copa: 'Brownie lovers' },
  { id: 'arequipe', n: ['Arequipe variegato', 'Arequipe variegato'], c: '#c98d4c', copa: 'Clasic banana split' },
  { id: 'pistacho', n: ['Pistacho', 'Pistachio'], c: '#b7c98a', copa: 'Pistacho crocante' },
  { id: 'brownie', n: ['Brownie', 'Brownie'], c: '#6b3d2a', copa: 'Brownie lovers' },
  { id: 'fresa', n: ['Fresa', 'Strawberry'], c: '#f2a7b4', copa: 'Tropical' },
];
export const TOPPINGS = [
  { id: 'panna', n: ['Panna', 'Panna'] },
  { id: 'fresas', n: ['Fresas', 'Strawberries'] },
  { id: 'nueces', n: ['Nueces', 'Nuts'] },
  { id: 'chocolate', n: ['Cobertura de chocolate', 'Chocolate drizzle'] },
];

// Galería (fotos reales)
export const GALLERY = [L.malteadas, L.pastas, L.torta, L.desayuno, L.fachada, L.costillas, L.panini, L.postre, L.tostada];

export const findItem = (name) => {
  for (const c of CARTA) { const it = c.items.find((x) => x[0] === name); if (it) return { cat: c, it }; }
  return null;
};
