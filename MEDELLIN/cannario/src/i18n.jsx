import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export const PHONE = '573152523958';

// Idiomas más usados por los visitantes de Colombia
export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'pt', label: 'Português', locale: 'pt-BR' },
  { code: 'fr', label: 'Français', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE' },
];
const IDX = Object.fromEntries(LANGS.map((l, i) => [l.code, i]));

export const DICT = {
  es: {
    loader: { switching: 'Cambiando idioma a', tag: 'Un verano mediterráneo', skip: 'Entrar' },
    nav: { exp: 'Experiencia', menu: 'Carta', gallery: 'Galería', visit: 'Ubicación', reserve: 'Reservar', open: 'Abrir menú', close: 'Cerrar menú', lang: 'Idioma' },
    hero: { eyebrow: 'Rooftop · Medellín · Colombia', l1: 'Un verano', l2: 'mediterráneo', trust: 'Cocina mediterránea · Coctelería de autor · Valet parking sin costo', tags: ['Rooftop con vista', 'Coctelería de autor'], ring: 'UN VERANO MEDITERRÁNEO · CANNARIO ROOFTOP · MEDELLÍN · ', lines: [['Un verano', 0], [1, 'mediterráneo'], ['sobre Medellín', 2]], place: 'Rooftop en Medellín', tag: 'Un verano mediterráneo', title: 'El Mediterráneo, sobre las luces de Medellín.', sub: 'Cocina de fuego lento, coctelería de autor y una terraza que se queda en la memoria.', c1: 'Reservar mesa', c2: 'Ver la carta', scroll: 'Desliza' },
    exp: {
      statement: 'Arriba, donde la ciudad se enciende, servimos el Mediterráneo como se vive en verano: sin prisa, con fuego lento, buen vino y Medellín a tus pies.',
      pillars: [
        { t: 'La terraza', d: 'Mesas al aire libre, luz cálida y la ciudad entera como telón de fondo.' },
        { t: 'La cocina', d: 'Producto del mar, brasas y recetas de la costa mediterránea, hechas al momento.' },
        { t: 'La barra', d: 'Spritz, clásicos bien hechos y cócteles de autor con fruta colombiana.' },
      ],
      valet: 'Valet parking sin costo para nuestros invitados',
    },
    menu: {
      full: 'Ver la carta completa', back: 'Volver al inicio', picks: 'Algunos favoritos de la casa. La carta completa, con fotos de cada plato, se abre en su propia pestaña.', 
      title: 'La carta', lead: 'Platos para compartir sin prisa y una barra pensada para alargar la noche.',
      food: 'Cocina', drinks: 'Bar', chef: 'Sugerencia del chef', veg: 'Vegetariano',
      note: 'Precios en pesos colombianos, impuestos incluidos. Pregunta por los platos fuera de carta del día.',
      cats: { mezze: 'Para compartir', sea: 'Del mar', rice: 'Pastas y arroces', grill: 'Brasas', sweet: 'Postres', signature: 'Cócteles de autor', spritz: 'Spritz y aperitivos', classics: 'Clásicos', wine: 'Vinos y burbujas', zero: 'Sin alcohol' },
    },
    gal: { hint: 'Desliza para girar la galería', title: 'La galería', lead: 'Una noche en Cannario, cuadro a cuadro.', close: 'Cerrar' },
    res: {
      title: 'Tu mesa te espera', lead: 'Cuéntanos cuándo vienes y te confirmamos por WhatsApp en minutos.',
      addr: 'Dirección', map: 'Abrir en Google Maps', phone: 'Reservas', hours: 'Horario', hoursV: 'Consulta el horario del día por WhatsApp', valet: 'Valet parking', valetV: 'Sin costo para nuestros invitados',
      formT: 'Reserva por WhatsApp', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', occasion: 'Ocasión', occ: ['Cena', 'Celebración', 'Aniversario', 'Negocios'], one: 'persona', many: 'personas', send: 'Enviar reserva por WhatsApp',
      msg: (n, d, h, p, o) => `Hola Cannario, quiero reservar.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}\nOcasión: ${o}`,
    },
    foot: { call: 'Llamar', rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { switching: 'Switching language to', tag: 'A Mediterranean summer', skip: 'Enter' },
    nav: { exp: 'Experience', menu: 'Menu', gallery: 'Gallery', visit: 'Location', reserve: 'Book', open: 'Open menu', close: 'Close menu', lang: 'Language' },
    hero: { eyebrow: 'Rooftop · Medellín · Colombia', l1: 'A Mediterranean', l2: 'summer', trust: 'Mediterranean cuisine · Signature cocktails · Complimentary valet', tags: ['Rooftop views', 'Signature cocktails'], ring: 'A MEDITERRANEAN SUMMER · CANNARIO ROOFTOP · MEDELLÍN · ', lines: [['Mediterranean', 0], [1, 'summer,'], ['above Medellín', 2]], place: 'Rooftop in Medellín', tag: 'A Mediterranean summer', title: 'The Mediterranean, above the lights of Medellín.', sub: 'Slow-fire cooking, signature cocktails and a terrace you will not forget.', c1: 'Book a table', c2: 'See the menu', scroll: 'Scroll' },
    exp: {
      statement: 'Up here, where the city lights up, we serve the Mediterranean the way summer is lived: unhurried, slow-fired, with good wine and Medellín at your feet.',
      pillars: [
        { t: 'The terrace', d: 'Open-air tables, warm light and the whole city as a backdrop.' },
        { t: 'The kitchen', d: 'Seafood, open fire and recipes from the Mediterranean coast, cooked to order.' },
        { t: 'The bar', d: 'Spritz, well-made classics and signature cocktails with Colombian fruit.' },
      ],
      valet: 'Complimentary valet parking for our guests',
    },
    menu: {
      full: 'See the full menu', back: 'Back to home', picks: 'A few house favorites. The full menu, with a photo of every dish, opens in its own tab.', 
      title: 'The menu', lead: 'Plates made for sharing and a bar built to make the night last.',
      food: 'Kitchen', drinks: 'Bar', chef: "Chef's pick", veg: 'Vegetarian',
      note: 'Prices in Colombian pesos, taxes included. Ask about today’s off-menu dishes.',
      cats: { mezze: 'To share', sea: 'From the sea', rice: 'Pasta & rice', grill: 'Open fire', sweet: 'Desserts', signature: 'Signature cocktails', spritz: 'Spritz & aperitivo', classics: 'Classics', wine: 'Wine & bubbles', zero: 'Zero proof' },
    },
    gal: { hint: 'Scroll to turn the gallery', title: 'The gallery', lead: 'A night at Cannario, frame by frame.', close: 'Close' },
    res: {
      title: 'Your table is waiting', lead: 'Tell us when you are coming and we will confirm on WhatsApp within minutes.',
      addr: 'Address', map: 'Open in Google Maps', phone: 'Reservations', hours: 'Hours', hoursV: 'Ask for today’s hours on WhatsApp', valet: 'Valet parking', valetV: 'Complimentary for our guests',
      formT: 'Book via WhatsApp', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', occasion: 'Occasion', occ: ['Dinner', 'Celebration', 'Anniversary', 'Business'], one: 'guest', many: 'guests', send: 'Send booking via WhatsApp',
      msg: (n, d, h, p, o) => `Hello Cannario, I would like to book.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}\nOccasion: ${o}`,
    },
    foot: { call: 'Call', rights: 'All rights reserved.', top: 'Back to top' },
  },
  pt: {
    loader: { switching: 'Mudando o idioma para', tag: 'Um verão mediterrâneo', skip: 'Entrar' },
    nav: { exp: 'Experiência', menu: 'Cardápio', gallery: 'Galeria', visit: 'Localização', reserve: 'Reservar', open: 'Abrir menu', close: 'Fechar menu', lang: 'Idioma' },
    hero: { eyebrow: 'Rooftop · Medellín · Colômbia', l1: 'Um verão', l2: 'mediterrâneo', trust: 'Cozinha mediterrânea · Coquetelaria autoral · Valet gratuito', tags: ['Rooftop com vista', 'Coquetelaria autoral'], ring: 'UM VERÃO MEDITERRÂNEO · CANNARIO ROOFTOP · MEDELLÍN · ', lines: [['Um verão', 0], [1, 'mediterrâneo'], ['sobre Medellín', 2]], place: 'Rooftop em Medellín', tag: 'Um verão mediterrâneo', title: 'O Mediterrâneo, sobre as luzes de Medellín.', sub: 'Cozinha de fogo lento, coquetelaria autoral e um terraço inesquecível.', c1: 'Reservar mesa', c2: 'Ver o cardápio', scroll: 'Deslize' },
    exp: {
      statement: 'Lá em cima, onde a cidade se acende, servimos o Mediterrâneo como se vive no verão: sem pressa, em fogo lento, com bom vinho e Medellín aos seus pés.',
      pillars: [
        { t: 'O terraço', d: 'Mesas ao ar livre, luz quente e a cidade inteira como cenário.' },
        { t: 'A cozinha', d: 'Frutos do mar, brasa e receitas da costa mediterrânea, feitas na hora.' },
        { t: 'O bar', d: 'Spritz, clássicos bem feitos e coquetéis autorais com frutas colombianas.' },
      ],
      valet: 'Valet gratuito para nossos convidados',
    },
    menu: {
      full: 'Ver o cardápio completo', back: 'Voltar ao início', picks: 'Alguns favoritos da casa. O cardápio completo, com foto de cada prato, abre em uma nova aba.', 
      title: 'O cardápio', lead: 'Pratos para compartilhar sem pressa e um bar feito para a noite durar.',
      food: 'Cozinha', drinks: 'Bar', chef: 'Sugestão do chef', veg: 'Vegetariano',
      note: 'Preços em pesos colombianos, impostos incluídos. Pergunte pelos pratos do dia.',
      cats: { mezze: 'Para compartilhar', sea: 'Do mar', rice: 'Massas e arrozes', grill: 'Brasa', sweet: 'Sobremesas', signature: 'Coquetéis autorais', spritz: 'Spritz e aperitivos', classics: 'Clássicos', wine: 'Vinhos e espumantes', zero: 'Sem álcool' },
    },
    gal: { hint: 'Deslize para girar a galeria', title: 'A galeria', lead: 'Uma noite no Cannario, quadro a quadro.', close: 'Fechar' },
    res: {
      title: 'Sua mesa espera por você', lead: 'Diga quando você vem e confirmamos pelo WhatsApp em minutos.',
      addr: 'Endereço', map: 'Abrir no Google Maps', phone: 'Reservas', hours: 'Horário', hoursV: 'Consulte o horário do dia pelo WhatsApp', valet: 'Valet', valetV: 'Gratuito para nossos convidados',
      formT: 'Reserve pelo WhatsApp', name: 'Nome', namePh: 'Seu nome', date: 'Data', time: 'Hora', people: 'Pessoas', occasion: 'Ocasião', occ: ['Jantar', 'Celebração', 'Aniversário de casal', 'Negócios'], one: 'pessoa', many: 'pessoas', send: 'Enviar reserva pelo WhatsApp',
      msg: (n, d, h, p, o) => `Olá Cannario, quero fazer uma reserva.\nNome: ${n}\nData: ${d}\nHora: ${h}\nPessoas: ${p}\nOcasião: ${o}`,
    },
    foot: { call: 'Ligar', rights: 'Todos os direitos reservados.', top: 'Voltar ao topo' },
  },
  fr: {
    loader: { switching: 'Changement de langue :', tag: 'Un été méditerranéen', skip: 'Entrer' },
    nav: { exp: 'Expérience', menu: 'Carte', gallery: 'Galerie', visit: 'Accès', reserve: 'Réserver', open: 'Ouvrir le menu', close: 'Fermer le menu', lang: 'Langue' },
    hero: { eyebrow: 'Rooftop · Medellín · Colombie', l1: 'Un été', l2: 'méditerranéen', trust: 'Cuisine méditerranéenne · Cocktails signature · Voiturier offert', tags: ['Rooftop avec vue', 'Cocktails signature'], ring: 'UN ÉTÉ MÉDITERRANÉEN · CANNARIO ROOFTOP · MEDELLÍN · ', lines: [['Un été', 0], [1, 'méditerranéen'], ['sur Medellín', 2]], place: 'Rooftop à Medellín', tag: 'Un été méditerranéen', title: 'La Méditerranée, au-dessus des lumières de Medellín.', sub: 'Cuisine au feu doux, cocktails signature et une terrasse inoubliable.', c1: 'Réserver une table', c2: 'Voir la carte', scroll: 'Défiler' },
    exp: {
      statement: 'Là-haut, quand la ville s’allume, nous servons la Méditerranée comme on vit l’été : sans hâte, au feu doux, avec un bon vin et Medellín à vos pieds.',
      pillars: [
        { t: 'La terrasse', d: 'Des tables en plein air, une lumière chaude et toute la ville en toile de fond.' },
        { t: 'La cuisine', d: 'Produits de la mer, braise et recettes de la côte méditerranéenne, cuisinés minute.' },
        { t: 'Le bar', d: 'Spritz, grands classiques et cocktails signature aux fruits colombiens.' },
      ],
      valet: 'Voiturier offert à nos invités',
    },
    menu: {
      full: 'Voir la carte complète', back: 'Retour à l’accueil', picks: 'Quelques favoris de la maison. La carte complète, avec la photo de chaque plat, s’ouvre dans un nouvel onglet.', 
      title: 'La carte', lead: 'Des assiettes à partager sans se presser et un bar pensé pour prolonger la nuit.',
      food: 'Cuisine', drinks: 'Bar', chef: 'Suggestion du chef', veg: 'Végétarien',
      note: 'Prix en pesos colombiens, taxes comprises. Demandez les suggestions du jour.',
      cats: { mezze: 'À partager', sea: 'De la mer', rice: 'Pâtes et riz', grill: 'À la braise', sweet: 'Desserts', signature: 'Cocktails signature', spritz: 'Spritz et apéritifs', classics: 'Classiques', wine: 'Vins et bulles', zero: 'Sans alcool' },
    },
    gal: { hint: 'Faites défiler pour tourner la galerie', title: 'La galerie', lead: 'Une soirée chez Cannario, image par image.', close: 'Fermer' },
    res: {
      title: 'Votre table vous attend', lead: 'Dites-nous quand vous venez, nous confirmons sur WhatsApp en quelques minutes.',
      addr: 'Adresse', map: 'Ouvrir dans Google Maps', phone: 'Réservations', hours: 'Horaires', hoursV: 'Horaires du jour sur WhatsApp', valet: 'Voiturier', valetV: 'Offert à nos invités',
      formT: 'Réserver via WhatsApp', name: 'Nom', namePh: 'Votre nom', date: 'Date', time: 'Heure', people: 'Personnes', occasion: 'Occasion', occ: ['Dîner', 'Célébration', 'Anniversaire', 'Affaires'], one: 'personne', many: 'personnes', send: 'Envoyer la réservation via WhatsApp',
      msg: (n, d, h, p, o) => `Bonjour Cannario, je souhaite réserver.\nNom : ${n}\nDate : ${d}\nHeure : ${h}\nPersonnes : ${p}\nOccasion : ${o}`,
    },
    foot: { call: 'Appeler', rights: 'Tous droits réservés.', top: 'Haut de page' },
  },
  de: {
    loader: { switching: 'Sprache wird umgestellt auf', tag: 'Ein mediterraner Sommer', skip: 'Eintreten' },
    nav: { exp: 'Erlebnis', menu: 'Karte', gallery: 'Galerie', visit: 'Anfahrt', reserve: 'Reservieren', open: 'Menü öffnen', close: 'Menü schließen', lang: 'Sprache' },
    hero: { eyebrow: 'Rooftop · Medellín · Kolumbien', l1: 'Ein mediterraner', l2: 'Sommer', trust: 'Mediterrane Küche · Signature-Cocktails · Kostenloser Parkservice', tags: ['Rooftop mit Aussicht', 'Signature-Cocktails'], ring: 'EIN MEDITERRANER SOMMER · CANNARIO ROOFTOP · MEDELLÍN · ', lines: [['Mediterraner', 0], [1, 'Sommer'], ['über Medellín', 2]], place: 'Rooftop in Medellín', tag: 'Ein mediterraner Sommer', title: 'Das Mittelmeer, über den Lichtern von Medellín.', sub: 'Küche vom langsamen Feuer, Signature-Cocktails und eine Terrasse, die man nicht vergisst.', c1: 'Tisch reservieren', c2: 'Zur Karte', scroll: 'Scrollen' },
    exp: {
      statement: 'Hier oben, wo die Stadt zu leuchten beginnt, servieren wir das Mittelmeer so, wie man den Sommer lebt: ohne Eile, über langsamem Feuer, mit gutem Wein und Medellín zu Ihren Füßen.',
      pillars: [
        { t: 'Die Terrasse', d: 'Tische unter freiem Himmel, warmes Licht und die ganze Stadt als Kulisse.' },
        { t: 'Die Küche', d: 'Meeresfrüchte, offenes Feuer und Rezepte der Mittelmeerküste, frisch zubereitet.' },
        { t: 'Die Bar', d: 'Spritz, gut gemachte Klassiker und Signature-Cocktails mit kolumbianischen Früchten.' },
      ],
      valet: 'Kostenloser Parkservice für unsere Gäste',
    },
    menu: {
      full: 'Ganze Karte ansehen', back: 'Zur Startseite', picks: 'Einige Lieblinge des Hauses. Die ganze Karte mit Fotos aller Gerichte öffnet sich in einem eigenen Tab.', 
      title: 'Die Karte', lead: 'Gerichte zum Teilen ohne Eile und eine Bar, die den Abend verlängert.',
      food: 'Küche', drinks: 'Bar', chef: 'Empfehlung des Küchenchefs', veg: 'Vegetarisch',
      note: 'Preise in kolumbianischen Pesos, inklusive Steuern. Fragen Sie nach den Tagesgerichten.',
      cats: { mezze: 'Zum Teilen', sea: 'Aus dem Meer', rice: 'Pasta & Reis', grill: 'Vom Feuer', sweet: 'Desserts', signature: 'Signature-Cocktails', spritz: 'Spritz & Aperitivo', classics: 'Klassiker', wine: 'Wein & Schaumwein', zero: 'Alkoholfrei' },
    },
    gal: { hint: 'Scrollen, um die Galerie zu drehen', title: 'Die Galerie', lead: 'Ein Abend im Cannario, Bild für Bild.', close: 'Schließen' },
    res: {
      title: 'Ihr Tisch wartet', lead: 'Sagen Sie uns, wann Sie kommen, wir bestätigen in wenigen Minuten per WhatsApp.',
      addr: 'Adresse', map: 'In Google Maps öffnen', phone: 'Reservierungen', hours: 'Öffnungszeiten', hoursV: 'Aktuelle Öffnungszeiten per WhatsApp', valet: 'Parkservice', valetV: 'Kostenlos für unsere Gäste',
      formT: 'Per WhatsApp reservieren', name: 'Name', namePh: 'Ihr Name', date: 'Datum', time: 'Uhrzeit', people: 'Personen', occasion: 'Anlass', occ: ['Abendessen', 'Feier', 'Jahrestag', 'Geschäftlich'], one: 'Person', many: 'Personen', send: 'Reservierung per WhatsApp senden',
      msg: (n, d, h, p, o) => `Hallo Cannario, ich möchte reservieren.\nName: ${n}\nDatum: ${d}\nUhrzeit: ${h}\nPersonen: ${p}\nAnlass: ${o}`,
    },
    foot: { call: 'Anrufen', rights: 'Alle Rechte vorbehalten.', top: 'Nach oben' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('cn_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return DICT[nav] ? nav : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('cn_lang', lang); } catch { /* sin almacenamiento */ }
  }, [lang]);
  // Los textos de la carta van como arreglos [es, en, pt, fr, de]
  const pick = useCallback((arr) => (Array.isArray(arr) ? arr[IDX[lang]] ?? arr[1] ?? arr[0] : arr), [lang]);
  // Cambio de idioma con un pequeño aviso de 2 s: el texto se cambia a mitad, detrás del velo
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  const changeLang = useCallback((code) => {
    if (!DICT[code] || code === lang || switching) return;
    timers.current.forEach(clearTimeout);
    setSwitching(code);
    timers.current = [
      setTimeout(() => setLang(code), 900),
      setTimeout(() => setSwitching(null), 2000),
    ];
  }, [lang, switching]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const value = useMemo(() => ({ lang, setLang: changeLang, switching, t: DICT[lang], pick, locale: LANGS[IDX[lang]].locale }), [lang, pick, changeLang, switching]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
