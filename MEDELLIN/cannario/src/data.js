// ============================================================
// CARTA Y GALERÍA — edita aquí platos, precios (COP) e imágenes.
// Textos en orden: [español, inglés, portugués, francés, alemán]
// Imágenes: por defecto fotos globales de Unsplash. Para usar fotos
// propias, pon el archivo en /public/images/... y cambia `img` por
// '/images/menu/mi-foto.jpg'. Precios y platos son de EJEMPLO.
// ============================================================

// Construye una URL optimizada de Unsplash (formato automático, recorte y calidad)
export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales de Cannario (tomadas de su Instagram). Reemplázalas por los originales en alta
// resolución con el mismo nombre de archivo en /public/images/local/ para que se vean más nítidas.
export const LOCAL = {
  salon: '/images/local/salon.jpg',
  plato: '/images/local/plato.jpg',
  letrero: '/images/local/letrero.jpg',
  barra: '/images/local/barra.jpg',
  postre: '/images/local/postre.jpg',
  mesa: '/images/local/mesa.jpg',
};

// Fondo del inicio: foto real del salón, desenfocada (el desenfoque disimula la baja resolución)
export const HERO_BG = '/images/local/hero-fondo.jpg';

// Foto dentro del emblema circular del inicio (letrero iluminado)
export const HERO_ARCH = LOCAL.mesa;

export const GROUPS = {
  food: ['mezze', 'sea', 'rice', 'grill', 'sweet'],
  drinks: ['signature', 'spritz', 'classics', 'wine', 'zero'],
};

// Imagen de portada de cada categoría
export const CAT_IMG = {
  mezze: '1414235077428-338989a2e8c0',
  sea: '1467003909585-2f8a72700288',
  rice: '1473093295043-cdd812d0e601',
  grill: '1600891964092-4316c288032e',
  sweet: '1578985545062-69928b1d9587',
  signature: '1514362545857-3bc16c4c7d1b',
  spritz: '1551024709-8f23befc6f87',
  classics: '1470337458703-46ad1756a187',
  wine: '1510812431401-41d2bd2722f3',
  zero: '1600271886742-f049cd451bba',
};

// flags: c = sugerencia del chef, v = vegetariano
const M = (id, cat, img, n, d, p, f = '') => ({ id, cat, img, n, d, p, chef: f.includes('c'), veg: f.includes('v') });
const same = (s) => [s, s, s, s, s];

export const MENU = [
  // ---------- Para compartir
  M(1, 'mezze', '1414235077428-338989a2e8c0', ['Hummus de la casa', 'House hummus', 'Homus da casa', 'Houmous maison', 'Hausgemachter Hummus'],
    ['Garbanzo sedoso, aceite de oliva ahumado, za’atar y pita del horno', 'Silky chickpea, smoked olive oil, za’atar and oven-baked pita', 'Grão-de-bico sedoso, azeite defumado, za’atar e pita assada', 'Pois chiche soyeux, huile d’olive fumée, za’atar et pita du four', 'Samtige Kichererbsen, geräuchertes Olivenöl, Za’atar und Ofen-Pita'], 36000, 'v'),
  M(2, 'mezze', '1540189549336-e6e99c3679fe', ['Burrata pugliese', 'Pugliese burrata', 'Burrata pugliese', 'Burrata des Pouilles', 'Burrata aus Apulien'],
    ['Tomates heirloom, pesto de albahaca y reducción de balsámico', 'Heirloom tomatoes, basil pesto and balsamic reduction', 'Tomates heirloom, pesto de manjericão e redução de balsâmico', 'Tomates anciennes, pesto de basilic et réduction balsamique', 'Heirloom-Tomaten, Basilikumpesto und Balsamico-Reduktion'], 52000, 'cv'),
  M(3, 'mezze', '1476224203421-9ac39bcb3327', ['Pulpo a la brasa', 'Charred octopus', 'Polvo na brasa', 'Poulpe à la braise', 'Oktopus vom Grill'],
    ['Papa criolla confitada, pimentón de la Vera y alioli de limón', 'Confit creole potatoes, smoked paprika and lemon aioli', 'Batata crioula confitada, páprica defumada e aioli de limão', 'Pommes de terre confites, paprika fumé et aïoli citron', 'Konfierte Kartoffeln, geräuchertes Paprika und Zitronen-Aioli'], 64000, 'c'),
  M(4, 'mezze', '1504674900247-0877df9cc836', ['Croquetas de jamón ibérico', 'Ibérico ham croquettes', 'Croquetes de presunto ibérico', 'Croquettes au jambon ibérique', 'Kroketten mit Ibérico-Schinken'],
    ['Seis unidades de bechamel cremosa y jamón curado 24 meses', 'Six creamy béchamel croquettes with 24-month cured ham', 'Seis unidades de bechamel cremoso e presunto curado 24 meses', 'Six pièces, béchamel crémeuse et jambon affiné 24 mois', 'Sechs Stück, cremige Béchamel und 24 Monate gereifter Schinken'], 42000),
  M(5, 'mezze', '1546833999-b9f581a1996d', ['Carpaccio de res', 'Beef carpaccio', 'Carpaccio de carne', 'Carpaccio de bœuf', 'Rindercarpaccio'],
    ['Lomo fino, rúcula, parmesano 24 meses y alcaparras fritas', 'Tenderloin, arugula, 24-month parmesan and fried capers', 'Filé, rúcula, parmesão 24 meses e alcaparras fritas', 'Filet, roquette, parmesan 24 mois et câpres frites', 'Filet, Rucola, 24 Monate Parmesan und frittierte Kapern'], 48000),
  M(6, 'mezze', '1551218808-94e220e084d2', ['Tabla mediterránea', 'Mediterranean board', 'Tábua mediterrânea', 'Planche méditerranéenne', 'Mediterrane Platte'],
    ['Quesos, curados, aceitunas, higos y pan de masa madre, para dos', 'Cheeses, cured meats, olives, figs and sourdough, for two', 'Queijos, curados, azeitonas, figos e pão de fermentação natural, para dois', 'Fromages, charcuterie, olives, figues et pain au levain, pour deux', 'Käse, Wurstwaren, Oliven, Feigen und Sauerteigbrot, für zwei'], 96000),

  // ---------- Del mar
  M(7, 'sea', '1519708227418-c8fd9a32b7a2', ['Crudo de pesca blanca', 'White fish crudo', 'Crudo de peixe branco', 'Cru de poisson blanc', 'Crudo vom weißen Fisch'],
    ['Cítricos, hinojo, aceite de albahaca y sal de Maldon', 'Citrus, fennel, basil oil and Maldon salt', 'Cítricos, erva-doce, óleo de manjericão e sal Maldon', 'Agrumes, fenouil, huile de basilic et sel de Maldon', 'Zitrus, Fenchel, Basilikumöl und Maldon-Salz'], 54000, 'c'),
  M(8, 'sea', '1579871494447-9811cf80d66c', ['Tartar de atún', 'Tuna tartare', 'Tartar de atum', 'Tartare de thon', 'Thunfisch-Tatar'],
    ['Atún aleta amarilla, aguacate, alcaparras y limón Meyer', 'Yellowfin tuna, avocado, capers and Meyer lemon', 'Atum albacora, abacate, alcaparras e limão Meyer', 'Thon albacore, avocat, câpres et citron Meyer', 'Gelbflossen-Thun, Avocado, Kapern und Meyer-Zitrone'], 62000),
  M(9, 'sea', '1504674900247-0877df9cc836', ['Langostinos al ajillo', 'Garlic prawns', 'Camarões ao alho', 'Gambas à l’ail', 'Garnelen in Knoblauch'],
    ['Guindilla, vino blanco, perejil y pan tostado para mojar', 'Chili, white wine, parsley and toasted bread for dipping', 'Pimenta, vinho branco, salsinha e pão tostado', 'Piment, vin blanc, persil et pain grillé', 'Chili, Weißwein, Petersilie und geröstetes Brot'], 68000),
  M(10, 'sea', '1467003909585-2f8a72700288', ['Salmón con costra de hierbas', 'Herb-crusted salmon', 'Salmão em crosta de ervas', 'Saumon en croûte d’herbes', 'Lachs mit Kräuterkruste'],
    ['Risotto de limón, espárragos y beurre blanc', 'Lemon risotto, asparagus and beurre blanc', 'Risoto de limão, aspargos e beurre blanc', 'Risotto au citron, asperges et beurre blanc', 'Zitronenrisotto, Spargel und Beurre blanc'], 82000),
  M(11, 'sea', '1476224203421-9ac39bcb3327', ['Pesca del día a la sal', 'Salt-baked catch of the day', 'Peixe do dia ao sal', 'Pêche du jour en croûte de sel', 'Fang des Tages in Salzkruste'],
    ['Salsa vierge, vegetales asados y aceite de oliva virgen', 'Sauce vierge, roasted vegetables and virgin olive oil', 'Molho vierge, legumes assados e azeite virgem', 'Sauce vierge, légumes rôtis et huile d’olive vierge', 'Sauce vierge, Ofengemüse und natives Olivenöl'], 92000),

  // ---------- Pastas y arroces
  M(12, 'rice', '1563379926898-05f4575a45d8', ['Arroz negro', 'Black rice', 'Arroz negro', 'Riz noir', 'Schwarzer Reis'],
    ['Tinta de calamar, calamar a la plancha y alioli suave', 'Squid ink, seared squid and mild aioli', 'Tinta de lula, lula grelhada e aioli suave', 'Encre de seiche, calamar snacké et aïoli doux', 'Sepiatinte, gebratener Tintenfisch und mildes Aioli'], 78000, 'c'),
  M(13, 'rice', '1473093295043-cdd812d0e601', ['Arroz de mariscos', 'Seafood rice', 'Arroz de frutos do mar', 'Riz aux fruits de mer', 'Meeresfrüchte-Reis'],
    ['Langostino, mejillón, calamar y sofrito de tomate, para dos', 'Prawn, mussels, squid and tomato sofrito, for two', 'Camarão, mexilhão, lula e refogado de tomate, para dois', 'Gambas, moules, calamar et sofrito de tomate, pour deux', 'Garnelen, Muscheln, Tintenfisch und Tomaten-Sofrito, für zwei'], 148000),
  M(14, 'rice', '1551183053-bf91a1d81141', ['Risotto de hongos y trufa', 'Mushroom & truffle risotto', 'Risoto de cogumelos e trufa', 'Risotto aux champignons et truffe', 'Pilz-Trüffel-Risotto'],
    ['Hongos silvestres, parmesano 24 meses y aceite de trufa negra', 'Wild mushrooms, 24-month parmesan and black truffle oil', 'Cogumelos silvestres, parmesão 24 meses e óleo de trufa negra', 'Champignons sauvages, parmesan 24 mois et huile de truffe noire', 'Waldpilze, 24 Monate Parmesan und Schwarzes Trüffelöl'], 72000, 'v'),
  M(15, 'rice', '1621996346565-e3dbc646d9a9', ['Tagliatelle al ragú', 'Tagliatelle al ragù', 'Tagliatelle ao ragu', 'Tagliatelle al ragù', 'Tagliatelle al Ragù'],
    ['Pasta fresca y ragú de res cocido durante ocho horas', 'Fresh pasta with an eight-hour beef ragù', 'Massa fresca e ragu de carne cozido por oito horas', 'Pâtes fraîches et ragù de bœuf mijoté huit heures', 'Frische Pasta mit acht Stunden geschmortem Rinderragù'], 66000),
  M(16, 'rice', '1563379926898-05f4575a45d8', ['Linguine alle vongole', 'Linguine alle vongole', 'Linguine alle vongole', 'Linguine alle vongole', 'Linguine alle Vongole'],
    ['Almejas, ajo, perejil, vino blanco y un toque de guindilla', 'Clams, garlic, parsley, white wine and a hint of chili', 'Vôngoles, alho, salsinha, vinho branco e um toque de pimenta', 'Palourdes, ail, persil, vin blanc et une pointe de piment', 'Venusmuscheln, Knoblauch, Petersilie, Weißwein und etwas Chili'], 74000),

  // ---------- Brasas
  M(17, 'grill', LOCAL.plato, ['Lomo fino 300 g', 'Tenderloin 300 g', 'Filé mignon 300 g', 'Filet de bœuf 300 g', 'Rinderfilet 300 g'],
    ['Mantequilla de hierbas y papas rústicas al romero', 'Herb butter and rosemary rustic potatoes', 'Manteiga de ervas e batatas rústicas ao alecrim', 'Beurre aux herbes et pommes rustiques au romarin', 'Kräuterbutter und rustikale Rosmarinkartoffeln'], 98000),
  M(18, 'grill', '1558030006-450675393462', ['Tomahawk madurado 1 kg', 'Dry-aged tomahawk 1 kg', 'Tomahawk maturado 1 kg', 'Tomahawk maturé 1 kg', 'Dry-aged Tomahawk 1 kg'],
    ['Para compartir. Maduración de 30 días, chimichurri y sal en escamas', 'To share. 30-day aged, chimichurri and flaky salt', 'Para compartilhar. Maturado 30 dias, chimichurri e sal em flocos', 'À partager. Maturé 30 jours, chimichurri et sel en flocons', 'Zum Teilen. 30 Tage gereift, Chimichurri und Flockensalz'], 248000, 'c'),
  M(19, 'grill', '1544025162-d76694265947', ['Rack de cordero', 'Rack of lamb', 'Carré de cordeiro', 'Carré d’agneau', 'Lammkarree'],
    ['Costra de pistacho y puré de berenjena ahumada', 'Pistachio crust and smoked eggplant purée', 'Crosta de pistache e purê de berinjela defumada', 'Croûte de pistache et purée d’aubergine fumée', 'Pistazienkruste und geräuchertes Auberginenpüree'], 132000),
  M(20, 'grill', '1555939594-58d7cb561ad1', ['Brochetas de pollo al limón', 'Lemon chicken skewers', 'Espetinhos de frango ao limão', 'Brochettes de poulet au citron', 'Zitronen-Hähnchenspieße'],
    ['Pollo de corral, orégano, yogur de ajo y papas aplastadas', 'Free-range chicken, oregano, garlic yogurt and smashed potatoes', 'Frango caipira, orégano, iogurte de alho e batatas amassadas', 'Poulet fermier, origan, yaourt à l’ail et pommes écrasées', 'Freilandhähnchen, Oregano, Knoblauchjoghurt und Quetschkartoffeln'], 64000),
  M(21, 'grill', '1546833999-b9f581a1996d', ['Picanha a las brasas', 'Flame-grilled picanha', 'Picanha na brasa', 'Picanha à la braise', 'Picanha vom Feuer'],
    ['Corte jugoso con chimichurri de hierbas y vegetales asados', 'Juicy cut with herb chimichurri and roasted vegetables', 'Corte suculento com chimichurri de ervas e legumes assados', 'Pièce juteuse, chimichurri aux herbes et légumes rôtis', 'Saftiges Stück mit Kräuter-Chimichurri und Ofengemüse'], 92000),

  // ---------- Postres
  M(22, 'sweet', '1571877227200-a0d98ea607e9', ['Tiramisú de la casa', 'House tiramisù', 'Tiramisù da casa', 'Tiramisu maison', 'Hausgemachtes Tiramisu'],
    ['Mascarpone, café de origen colombiano y cacao amargo', 'Mascarpone, single-origin Colombian coffee and bitter cocoa', 'Mascarpone, café colombiano de origem e cacau amargo', 'Mascarpone, café colombien d’origine et cacao amer', 'Mascarpone, kolumbianischer Single-Origin-Kaffee und Kakao'], 32000, 'cv'),
  M(23, 'sweet', '1488477181946-6428a0291777', ['Crema catalana', 'Crema catalana', 'Crema catalana', 'Crème catalane', 'Crema Catalana'],
    ['Crema de cítricos con azúcar quemado al momento', 'Citrus custard with sugar torched to order', 'Creme cítrico com açúcar queimado na hora', 'Crème aux agrumes, sucre caramélisé minute', 'Zitruscreme mit frisch karamellisiertem Zucker'], 28000, 'v'),
  M(24, 'sweet', '1578985545062-69928b1d9587', ['Volcán de chocolate', 'Chocolate fondant', 'Petit gâteau', 'Fondant au chocolat', 'Schokoladen-Fondant'],
    ['Chocolate 70 %, corazón fundido y helado de vainilla', '70% chocolate, molten heart and vanilla ice cream', 'Chocolate 70 %, recheio derretido e sorvete de baunilha', 'Chocolat 70 %, cœur coulant et glace vanille', '70 % Schokolade, flüssiger Kern und Vanilleeis'], 30000, 'v'),
  M(25, 'sweet', '1565958011703-44f9829ba187', ['Baklava de pistacho', 'Pistachio baklava', 'Baklava de pistache', 'Baklava à la pistache', 'Pistazien-Baklava'],
    ['Miel de azahar y helado de yogur griego', 'Orange-blossom honey and Greek yogurt ice cream', 'Mel de flor de laranjeira e sorvete de iogurte grego', 'Miel de fleur d’oranger et glace au yaourt grec', 'Orangenblütenhonig und Eis aus griechischem Joghurt'], 29000, 'v'),
  M(26, 'sweet', '1563805042-7684c019e1cb', ['Gelato artesanal', 'Artisan gelato', 'Gelato artesanal', 'Gelato artisanal', 'Handgemachtes Gelato'],
    ['Tres sabores de temporada con crocante de almendra', 'Three seasonal flavors with almond crunch', 'Três sabores da estação com crocante de amêndoa', 'Trois parfums de saison et croquant d’amande', 'Drei Sorten der Saison mit Mandelkrokant'], 24000, 'v'),

  // ---------- Cócteles de autor
  M(27, 'signature', '1514362545857-3bc16c4c7d1b', same('Cannario Gold'),
    ['Ron añejo, maracuyá, miel de azahar y espuma cítrica', 'Aged rum, passion fruit, orange-blossom honey and citrus foam', 'Rum envelhecido, maracujá, mel de laranjeira e espuma cítrica', 'Rhum vieux, fruit de la passion, miel d’oranger et écume d’agrumes', 'Gereifter Rum, Maracuja, Orangenblütenhonig und Zitrusschaum'], 46000, 'c'),
  M(28, 'signature', '1587223962930-cb7f31384c19', ['Verano Mediterráneo', 'Mediterranean Summer', 'Verão Mediterrâneo', 'Été Méditerranéen', 'Mediterraner Sommer'],
    ['Gin, pepino, albahaca y tónica de flor de saúco', 'Gin, cucumber, basil and elderflower tonic', 'Gin, pepino, manjericão e tônica de flor de sabugueiro', 'Gin, concombre, basilic et tonic à la fleur de sureau', 'Gin, Gurke, Basilikum und Holunderblüten-Tonic'], 44000),
  M(29, 'signature', '1536935338788-846bb9981813', ['Humo de Medellín', 'Medellín Smoke', 'Fumaça de Medellín', 'Fumée de Medellín', 'Medellín-Rauch'],
    ['Mezcal, lulo, ají dulce y sal ahumada', 'Mezcal, lulo, sweet pepper and smoked salt', 'Mezcal, lulo, pimenta doce e sal defumado', 'Mezcal, lulo, piment doux et sel fumé', 'Mezcal, Lulo, süße Paprika und Rauchsalz'], 48000),
  M(30, 'signature', '1560512823-829485b8bf24', ['Olivo', 'Olivo', 'Olivo', 'Olivo', 'Olivo'],
    ['Vodka lavado en aceite de oliva, vermut seco y aceituna gordal', 'Olive-oil washed vodka, dry vermouth and gordal olive', 'Vodka lavada em azeite, vermute seco e azeitona gordal', 'Vodka infusée à l’huile d’olive, vermouth sec et olive gordal', 'Mit Olivenöl gewaschener Wodka, trockener Wermut und Gordal-Olive'], 46000),
  M(31, 'signature', '1543007630-9710e4a00a20', ['Higo y romero', 'Fig & rosemary', 'Figo e alecrim', 'Figue et romarin', 'Feige & Rosmarin'],
    ['Bourbon, higo, romero y amargo de naranja', 'Bourbon, fig, rosemary and orange bitters', 'Bourbon, figo, alecrim e bitter de laranja', 'Bourbon, figue, romarin et bitter orange', 'Bourbon, Feige, Rosmarin und Orangenbitter'], 48000),
  M(32, 'signature', '1551024709-8f23befc6f87', ['Rosa de Amalfi', 'Amalfi Rose', 'Rosa de Amalfi', 'Rose d’Amalfi', 'Amalfi-Rose'],
    ['Limoncello, prosecco, frutos rojos y pomelo', 'Limoncello, prosecco, red berries and grapefruit', 'Limoncello, prosecco, frutas vermelhas e toranja', 'Limoncello, prosecco, fruits rouges et pamplemousse', 'Limoncello, Prosecco, rote Beeren und Grapefruit'], 44000),

  // ---------- Spritz y aperitivos
  M(33, 'spritz', '1551024709-8f23befc6f87', same('Aperol Spritz'),
    ['Aperol, prosecco, soda y naranja', 'Aperol, prosecco, soda and orange', 'Aperol, prosecco, soda e laranja', 'Aperol, prosecco, soda et orange', 'Aperol, Prosecco, Soda und Orange'], 38000),
  M(34, 'spritz', '1587223962930-cb7f31384c19', same('Hugo Spritz'),
    ['Flor de saúco, prosecco, hierbabuena y lima', 'Elderflower, prosecco, mint and lime', 'Flor de sabugueiro, prosecco, hortelã e limão', 'Fleur de sureau, prosecco, menthe et citron vert', 'Holunderblüte, Prosecco, Minze und Limette'], 38000),
  M(35, 'spritz', '1514362545857-3bc16c4c7d1b', same('Limoncello Spritz'),
    ['Limoncello de la casa, prosecco y soda', 'House limoncello, prosecco and soda', 'Limoncello da casa, prosecco e soda', 'Limoncello maison, prosecco et soda', 'Hausgemachter Limoncello, Prosecco und Soda'], 40000, 'c'),
  M(36, 'spritz', '1536935338788-846bb9981813', same('Negroni Sbagliato'),
    ['Campari, vermut rosso y prosecco', 'Campari, rosso vermouth and prosecco', 'Campari, vermute rosso e prosecco', 'Campari, vermouth rosso et prosecco', 'Campari, roter Wermut und Prosecco'], 40000),

  // ---------- Clásicos
  M(37, 'classics', '1470337458703-46ad1756a187', same('Negroni'),
    ['Gin, vermut rosso y Campari', 'Gin, rosso vermouth and Campari', 'Gin, vermute rosso e Campari', 'Gin, vermouth rosso et Campari', 'Gin, roter Wermut und Campari'], 40000),
  M(38, 'classics', '1543007630-9710e4a00a20', same('Old Fashioned'),
    ['Bourbon, azúcar de caña, amargo de Angostura y naranja', 'Bourbon, cane sugar, Angostura bitters and orange', 'Bourbon, açúcar de cana, bitter Angostura e laranja', 'Bourbon, sucre de canne, Angostura et orange', 'Bourbon, Rohrzucker, Angostura und Orange'], 42000),
  M(39, 'classics', '1497534446932-c925b458314e', same('Espresso Martini'),
    ['Vodka, espresso colombiano y licor de café', 'Vodka, Colombian espresso and coffee liqueur', 'Vodka, espresso colombiano e licor de café', 'Vodka, espresso colombien et liqueur de café', 'Wodka, kolumbianischer Espresso und Kaffeelikör'], 40000),
  M(40, 'classics', '1560512823-829485b8bf24', same('Dry Martini'),
    ['Gin o vodka, vermut seco, aceituna o twist de limón', 'Gin or vodka, dry vermouth, olive or lemon twist', 'Gin ou vodka, vermute seco, azeitona ou twist de limão', 'Gin ou vodka, vermouth sec, olive ou zeste de citron', 'Gin oder Wodka, trockener Wermut, Olive oder Zitronenzeste'], 42000),
  M(41, 'classics', '1556679343-c7306c1976bc', same('Margarita'),
    ['Tequila reposado, triple sec y limón fresco', 'Reposado tequila, triple sec and fresh lime', 'Tequila reposado, triple sec e limão fresco', 'Tequila reposado, triple sec et citron vert frais', 'Tequila Reposado, Triple Sec und frische Limette'], 38000),

  // ---------- Vinos y burbujas
  M(42, 'wine', '1510812431401-41d2bd2722f3', ['Copa de tinto', 'Glass of red', 'Taça de tinto', 'Verre de rouge', 'Glas Rotwein'],
    ['Selección del sommelier, Rioja o Toscana', 'Sommelier’s selection, Rioja or Tuscany', 'Seleção do sommelier, Rioja ou Toscana', 'Sélection du sommelier, Rioja ou Toscane', 'Auswahl des Sommeliers, Rioja oder Toskana'], 36000),
  M(43, 'wine', '1506377247377-2a5b3b417ebb', ['Copa de blanco', 'Glass of white', 'Taça de branco', 'Verre de blanc', 'Glas Weißwein'],
    ['Albariño o Sauvignon Blanc bien frío', 'Chilled Albariño or Sauvignon Blanc', 'Albariño ou Sauvignon Blanc bem gelado', 'Albariño ou Sauvignon Blanc bien frais', 'Gut gekühlter Albariño oder Sauvignon Blanc'], 36000),
  M(44, 'wine', '1510812431401-41d2bd2722f3', ['Rosado de Provenza', 'Provence rosé', 'Rosé da Provença', 'Rosé de Provence', 'Rosé aus der Provence'],
    ['La copa del verano mediterráneo', 'The glass of a Mediterranean summer', 'A taça do verão mediterrâneo', 'Le verre de l’été méditerranéen', 'Das Glas des mediterranen Sommers'], 42000, 'c'),
  M(45, 'wine', '1506377247377-2a5b3b417ebb', ['Prosecco (copa)', 'Prosecco (glass)', 'Prosecco (taça)', 'Prosecco (verre)', 'Prosecco (Glas)'],
    ['Burbuja fina del Véneto para brindar', 'Fine Veneto bubbles for a toast', 'Borbulha fina do Vêneto para brindar', 'Fines bulles de Vénétie pour trinquer', 'Feine Perlage aus Venetien zum Anstoßen'], 38000),
  M(46, 'wine', '1510812431401-41d2bd2722f3', ['Champagne (botella)', 'Champagne (bottle)', 'Champagne (garrafa)', 'Champagne (bouteille)', 'Champagner (Flasche)'],
    ['Brut de la casa, servido en cubeta con hielo', 'House brut, served on ice', 'Brut da casa, servido no balde com gelo', 'Brut maison, servi en seau à glace', 'Hauseigener Brut, im Eiskühler serviert'], 520000),

  // ---------- Sin alcohol
  M(47, 'zero', '1600271886742-f049cd451bba', ['Spritz sin alcohol', 'Zero-proof spritz', 'Spritz sem álcool', 'Spritz sans alcool', 'Alkoholfreier Spritz'],
    ['Aperitivo amargo sin alcohol, naranja y soda', 'Non-alcoholic bitter aperitif, orange and soda', 'Aperitivo amargo sem álcool, laranja e soda', 'Apéritif amer sans alcool, orange et soda', 'Alkoholfreier Bitter-Aperitif, Orange und Soda'], 26000),
  M(48, 'zero', '1600271886742-f049cd451bba', ['Limonada de coco', 'Coconut lemonade', 'Limonada de coco', 'Citronnade coco', 'Kokos-Limonade'],
    ['Cremosa, fría y con leche de coco natural', 'Creamy, cold, made with fresh coconut milk', 'Cremosa, gelada e com leite de coco natural', 'Onctueuse, fraîche, au lait de coco naturel', 'Cremig, eiskalt, mit frischer Kokosmilch'], 18000),
  M(49, 'zero', '1556679343-c7306c1976bc', ['Jardín de pepino', 'Cucumber garden', 'Jardim de pepino', 'Jardin de concombre', 'Gurkengarten'],
    ['Pepino, albahaca, lima y tónica premium', 'Cucumber, basil, lime and premium tonic', 'Pepino, manjericão, limão e tônica premium', 'Concombre, basilic, citron vert et tonic premium', 'Gurke, Basilikum, Limette und Premium-Tonic'], 22000),
  M(50, 'zero', '1587223962930-cb7f31384c19', ['Té helado de frutos rojos', 'Red berry iced tea', 'Chá gelado de frutas vermelhas', 'Thé glacé aux fruits rouges', 'Eistee mit roten Beeren'],
    ['Infusión de la casa, limón y hierbabuena', 'House infusion, lemon and mint', 'Infusão da casa, limão e hortelã', 'Infusion maison, citron et menthe', 'Hausaufguss, Zitrone und Minze'], 16000),
];

// Galería (anillo 3D): mezcla de fotos reales del local y fotos globales
export const GALLERY = [
  LOCAL.letrero,
  '1414235077428-338989a2e8c0',
  LOCAL.salon,
  '1470337458703-46ad1756a187',
  LOCAL.plato,
  '1517248135467-4c7edcad34c4',
  LOCAL.mesa,
  '1514362545857-3bc16c4c7d1b',
  LOCAL.barra,
  '1600891964092-4316c288032e',
  LOCAL.postre,
  '1551024709-8f23befc6f87',
];

export const PILLAR_IMG = [LOCAL.salon, LOCAL.plato, '1470337458703-46ad1756a187'];
