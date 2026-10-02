import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO — completa los WhatsApp de cada casa (solo números con
// indicativo, ej. '573001234567'). Si quedan vacíos, los botones
// de domicilio llevan al Linktree y las reservas van por Instagram.
// ============================================================
export const IG = 'feelfresco_';
export const TIKTOK = 'https://www.tiktok.com/@feelfresco_';
export const LINKTREE = 'https://linktr.ee/feelfresco';
export const HOUSES = [
  {
    id: 'terrazas', name: 'Terrazas', phone: '',
    address: 'Cra 45 # 56-84, Terrazas, Bucaramanga',
    maps: 'https://www.google.com/maps/search/?api=1&query=Feel+Fresco+Cra+45+%2356-84+Bucaramanga',
  },
  {
    id: 'canaveral', name: 'Cañaveral', phone: '',
    address: 'Calle 33 # 26-73, Cañaveral, Floridablanca',
    maps: 'https://www.google.com/maps/search/?api=1&query=Feel+Fresco+Ca%C3%B1averal+Floridablanca',
  },
];

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
    loader: { tag: 'Las smash burgers más frescas', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { smash: 'La smash', menu: 'Menú', club: 'Burger Club', houses: 'Casas rosas', gallery: 'Galería', reserve: 'Reservas gratis', order: 'Pedir', open: 'Abrir menú', close: 'Cerrar menú', lang: 'Idioma' },
    hero: {
      eyebrow: 'Smash burgers · Bucaramanga', l1: 'Don’t stress,', l2: 'feel fresco.',
      sub: 'Las smash burgers más frescas, aplastadas al momento en la plancha y servidas en nuestras dos casas rosas.',
      c1: 'Pedir a domicilio', c2: 'Reservas gratis', c3: 'Ver el menú', open: 'Abierto ahora', today: 'Hoy desde las', stickers: ['100 % smash', '¡Extra, extra!', 'Burger Club'],
    },
    tape: ['Don’t stress', 'Feel fresco', 'Smash burgers', 'Burger Club', 'Dos casas rosas', 'Reservas gratis'],
    smash: {
      eyebrow: 'Así nace una smash', title: 'Bola, plancha y ¡smash!',
      steps: [
        { t: 'Una bola de carne fresca', d: 'Carne de res fresca, molida todos los días, en una bolita que pesa justo lo que debe.' },
        { t: '¡Smash! contra la plancha', d: 'La aplastamos con fuerza sobre la plancha bien caliente. Ahí nace la magia.' },
        { t: 'Costra dorada y crujiente', d: 'Los bordes se caramelizan y quedan crocantes, el centro sigue jugoso.' },
        { t: 'Queso derretido y listo', d: 'Cheddar fundido encima, pan suave y a tus manos. Así de fresco.' },
      ],
      hint: 'Sigue bajando',
    },
    menu: {
      title: 'El menú', lead: 'Smash burgers, papas, churros y malteadas. Toca una categoría o mira el menú completo con fotos.',
      full: 'Ver el menú completo', back: 'Volver al inicio', picks: 'Las favoritas', fav: 'Favorita', hot: 'Picante', veg: 'Vegetariana',
      note: 'Precios de referencia en pesos colombianos. Pregunta por los lanzamientos del Burger Club.',
      cats: { burgers: 'Smash burgers', combos: 'Combos', fries: 'Papas', sweets: 'Churros y postres', shakes: 'Malteadas', drinks: 'Bebidas' },
    },
    club: {
      title: 'Únete al Burger Club', lead: 'Lanzamientos, ediciones de “última hora”, promos y todo lo que pasa en las casas rosas, primero para el club.',
      points: ['Lanzamientos antes que nadie', 'Promos solo para el club', 'Detrás de cámaras de la plancha'], cta: 'Entrar al Burger Club',
    },
    houses: {
      title: 'Nuestras dos casas rosas', lead: 'Elige la más cercana: ven a comer, reserva gratis o pide a domicilio por WhatsApp.',
      hours: 'Todos los días desde las 6:00 p. m. hasta las 10:00 p. m. (fines de semana hasta las 11:00 p. m.)',
      map: 'Cómo llegar', domi: 'Domicilios por WhatsApp', open: 'Abierto ahora', closed: 'Abrimos a las 6:00 p. m.',
    },
    gal: { title: 'Fresco por dentro', lead: 'Casas rosas, palmeras y smash burgers.', close: 'Cerrar', hint: 'Desliza para pasar' },
    res: {
      title: 'Reservas gratis', lead: 'Escoge la casa, el día y cuántos vienen. Te confirmamos por mensaje.',
      house: 'Casa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', one: 'persona', many: 'personas',
      send: 'Reservar por WhatsApp', sendIg: 'Reservar por Instagram', copied: 'Mensaje copiado. Pégalo en el chat de Instagram que se acaba de abrir.',
      msg: (c, n, d, h, p) => `¡Hola Feel Fresco! 🌴 Quiero reservar en la casa ${c}.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { tag: 'The freshest smash burgers', skip: 'Enter', switching: 'Switching language to' },
    nav: { smash: 'The smash', menu: 'Menu', club: 'Burger Club', houses: 'Pink houses', gallery: 'Gallery', reserve: 'Free booking', order: 'Order', open: 'Open menu', close: 'Close menu', lang: 'Language' },
    hero: {
      eyebrow: 'Smash burgers · Bucaramanga', l1: 'Don’t stress,', l2: 'feel fresco.',
      sub: 'The freshest smash burgers, smashed to order on the griddle and served in our two pink houses.',
      c1: 'Order delivery', c2: 'Free booking', c3: 'See the menu', open: 'Open now', today: 'Today from', stickers: ['100% smash', 'Extra, extra!', 'Burger Club'],
    },
    tape: ['Don’t stress', 'Feel fresco', 'Smash burgers', 'Burger Club', 'Two pink houses', 'Free booking'],
    smash: {
      eyebrow: 'How a smash is born', title: 'Ball, griddle and smash!',
      steps: [
        { t: 'A ball of fresh beef', d: 'Fresh beef, ground every day, rolled into a ball that weighs exactly what it should.' },
        { t: 'Smash! onto the griddle', d: 'We press it hard onto a scorching griddle. That is where the magic happens.' },
        { t: 'A golden, crispy crust', d: 'The edges caramelize and get crunchy while the center stays juicy.' },
        { t: 'Melted cheese and done', d: 'Melted cheddar on top, a soft bun and into your hands. That fresh.' },
      ],
      hint: 'Keep scrolling',
    },
    menu: {
      title: 'The menu', lead: 'Smash burgers, fries, churros and shakes. Tap a category or see the full menu with photos.',
      full: 'See the full menu', back: 'Back to home', picks: 'Favorites', fav: 'Favorite', hot: 'Spicy', veg: 'Vegetarian',
      note: 'Reference prices in Colombian pesos. Ask about the latest Burger Club releases.',
      cats: { burgers: 'Smash burgers', combos: 'Combos', fries: 'Fries', sweets: 'Churros & desserts', shakes: 'Shakes', drinks: 'Drinks' },
    },
    club: {
      title: 'Join the Burger Club', lead: 'New releases, “last minute” editions, promos and everything happening at the pink houses, club first.',
      points: ['New releases before anyone else', 'Club-only promos', 'Behind the scenes at the griddle'], cta: 'Join the Burger Club',
    },
    houses: {
      title: 'Our two pink houses', lead: 'Pick the closest one: come and eat, book for free or order delivery on WhatsApp.',
      hours: 'Every day from 6:00 pm to 10:00 pm (weekends until 11:00 pm)',
      map: 'Get directions', domi: 'Delivery via WhatsApp', open: 'Open now', closed: 'We open at 6:00 pm',
    },
    gal: { title: 'Fresh inside', lead: 'Pink houses, palm trees and smash burgers.', close: 'Close', hint: 'Swipe to browse' },
    res: {
      title: 'Free booking', lead: 'Pick the house, the day and how many are coming. We confirm by message.',
      house: 'House', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', one: 'guest', many: 'guests',
      send: 'Book via WhatsApp', sendIg: 'Book via Instagram', copied: 'Message copied. Paste it into the Instagram chat that just opened.',
      msg: (c, n, d, h, p) => `Hi Feel Fresco! 🌴 I would like to book at the ${c} house.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
  pt: {
    loader: { tag: 'Os smash burgers mais frescos', skip: 'Entrar', switching: 'Mudando o idioma para' },
    nav: { smash: 'O smash', menu: 'Cardápio', club: 'Burger Club', houses: 'Casas rosas', gallery: 'Galeria', reserve: 'Reserva grátis', order: 'Pedir', open: 'Abrir menu', close: 'Fechar menu', lang: 'Idioma' },
    hero: {
      eyebrow: 'Smash burgers · Bucaramanga', l1: 'Don’t stress,', l2: 'feel fresco.',
      sub: 'Os smash burgers mais frescos, prensados na hora na chapa e servidos nas nossas duas casas rosas.',
      c1: 'Pedir delivery', c2: 'Reserva grátis', c3: 'Ver o cardápio', open: 'Aberto agora', today: 'Hoje a partir das', stickers: ['100% smash', 'Extra, extra!', 'Burger Club'],
    },
    tape: ['Don’t stress', 'Feel fresco', 'Smash burgers', 'Burger Club', 'Duas casas rosas', 'Reserva grátis'],
    smash: {
      eyebrow: 'Como nasce um smash', title: 'Bola, chapa e smash!',
      steps: [
        { t: 'Uma bola de carne fresca', d: 'Carne bovina fresca, moída todos os dias, numa bolinha com o peso certinho.' },
        { t: 'Smash! na chapa', d: 'Prensamos com força na chapa bem quente. É aí que a mágica acontece.' },
        { t: 'Crosta dourada e crocante', d: 'As bordas caramelizam e ficam crocantes, e o centro continua suculento.' },
        { t: 'Queijo derretido e pronto', d: 'Cheddar derretido por cima, pão macio e direto para as suas mãos.' },
      ],
      hint: 'Continue descendo',
    },
    menu: {
      title: 'O cardápio', lead: 'Smash burgers, batatas, churros e milk-shakes. Toque numa categoria ou veja o cardápio completo com fotos.',
      full: 'Ver o cardápio completo', back: 'Voltar ao início', picks: 'Os favoritos', fav: 'Favorito', hot: 'Picante', veg: 'Vegetariano',
      note: 'Preços de referência em pesos colombianos. Pergunte pelos lançamentos do Burger Club.',
      cats: { burgers: 'Smash burgers', combos: 'Combos', fries: 'Batatas', sweets: 'Churros e sobremesas', shakes: 'Milk-shakes', drinks: 'Bebidas' },
    },
    club: {
      title: 'Entre no Burger Club', lead: 'Lançamentos, edições de “última hora”, promoções e tudo o que acontece nas casas rosas, primeiro para o clube.',
      points: ['Lançamentos antes de todo mundo', 'Promoções só para o clube', 'Bastidores da chapa'], cta: 'Entrar no Burger Club',
    },
    houses: {
      title: 'Nossas duas casas rosas', lead: 'Escolha a mais perto: venha comer, reserve grátis ou peça delivery pelo WhatsApp.',
      hours: 'Todos os dias das 18h às 22h (fins de semana até as 23h)',
      map: 'Como chegar', domi: 'Delivery pelo WhatsApp', open: 'Aberto agora', closed: 'Abrimos às 18h',
    },
    gal: { title: 'Fresco por dentro', lead: 'Casas rosas, palmeiras e smash burgers.', close: 'Fechar', hint: 'Deslize para passar' },
    res: {
      title: 'Reserva grátis', lead: 'Escolha a casa, o dia e quantas pessoas vêm. Confirmamos por mensagem.',
      house: 'Casa', name: 'Nome', namePh: 'Seu nome', date: 'Data', time: 'Hora', people: 'Pessoas', one: 'pessoa', many: 'pessoas',
      send: 'Reservar pelo WhatsApp', sendIg: 'Reservar pelo Instagram', copied: 'Mensagem copiada. Cole no chat do Instagram que acabou de abrir.',
      msg: (c, n, d, h, p) => `Olá Feel Fresco! 🌴 Quero reservar na casa ${c}.\nNome: ${n}\nData: ${d}\nHora: ${h}\nPessoas: ${p}`,
    },
    foot: { rights: 'Todos os direitos reservados.', top: 'Voltar ao topo' },
  },
  fr: {
    loader: { tag: 'Les smash burgers les plus frais', skip: 'Entrer', switching: 'Changement de langue :' },
    nav: { smash: 'Le smash', menu: 'Menu', club: 'Burger Club', houses: 'Maisons roses', gallery: 'Galerie', reserve: 'Réservation gratuite', order: 'Commander', open: 'Ouvrir le menu', close: 'Fermer le menu', lang: 'Langue' },
    hero: {
      eyebrow: 'Smash burgers · Bucaramanga', l1: 'Don’t stress,', l2: 'feel fresco.',
      sub: 'Les smash burgers les plus frais, écrasés minute sur la plancha et servis dans nos deux maisons roses.',
      c1: 'Se faire livrer', c2: 'Réservation gratuite', c3: 'Voir le menu', open: 'Ouvert', today: 'Aujourd’hui dès', stickers: ['100 % smash', 'Extra, extra !', 'Burger Club'],
    },
    tape: ['Don’t stress', 'Feel fresco', 'Smash burgers', 'Burger Club', 'Deux maisons roses', 'Réservation gratuite'],
    smash: {
      eyebrow: 'Comment naît un smash', title: 'Boule, plancha et smash !',
      steps: [
        { t: 'Une boule de bœuf frais', d: 'Du bœuf frais, haché chaque jour, en une boule au poids parfait.' },
        { t: 'Smash ! sur la plancha', d: 'On l’écrase fort sur une plancha brûlante. C’est là que la magie opère.' },
        { t: 'Une croûte dorée et croustillante', d: 'Les bords caramélisent et croustillent, le cœur reste juteux.' },
        { t: 'Fromage fondu et c’est prêt', d: 'Cheddar fondu, pain moelleux et directement dans vos mains.' },
      ],
      hint: 'Continuez à défiler',
    },
    menu: {
      title: 'Le menu', lead: 'Smash burgers, frites, churros et milk-shakes. Touchez une catégorie ou voyez le menu complet en photos.',
      full: 'Voir le menu complet', back: 'Retour à l’accueil', picks: 'Les préférés', fav: 'Préféré', hot: 'Épicé', veg: 'Végétarien',
      note: 'Prix indicatifs en pesos colombiens. Demandez les nouveautés du Burger Club.',
      cats: { burgers: 'Smash burgers', combos: 'Menus', fries: 'Frites', sweets: 'Churros et desserts', shakes: 'Milk-shakes', drinks: 'Boissons' },
    },
    club: {
      title: 'Rejoignez le Burger Club', lead: 'Nouveautés, éditions « dernière minute », promos et tout ce qui se passe dans les maisons roses, d’abord pour le club.',
      points: ['Les nouveautés avant tout le monde', 'Des promos réservées au club', 'Les coulisses de la plancha'], cta: 'Rejoindre le Burger Club',
    },
    houses: {
      title: 'Nos deux maisons roses', lead: 'Choisissez la plus proche : venez manger, réservez gratuitement ou faites-vous livrer via WhatsApp.',
      hours: 'Tous les jours de 18 h à 22 h (le week-end jusqu’à 23 h)',
      map: 'Itinéraire', domi: 'Livraison via WhatsApp', open: 'Ouvert', closed: 'Ouverture à 18 h',
    },
    gal: { title: 'Frais à l’intérieur', lead: 'Maisons roses, palmiers et smash burgers.', close: 'Fermer', hint: 'Glissez pour passer' },
    res: {
      title: 'Réservation gratuite', lead: 'Choisissez la maison, le jour et le nombre de personnes. Nous confirmons par message.',
      house: 'Maison', name: 'Nom', namePh: 'Votre nom', date: 'Date', time: 'Heure', people: 'Personnes', one: 'personne', many: 'personnes',
      send: 'Réserver via WhatsApp', sendIg: 'Réserver via Instagram', copied: 'Message copié. Collez-le dans la conversation Instagram qui vient de s’ouvrir.',
      msg: (c, n, d, h, p) => `Bonjour Feel Fresco ! 🌴 Je souhaite réserver à la maison ${c}.\nNom : ${n}\nDate : ${d}\nHeure : ${h}\nPersonnes : ${p}`,
    },
    foot: { rights: 'Tous droits réservés.', top: 'Haut de page' },
  },
  de: {
    loader: { tag: 'Die frischesten Smash Burger', skip: 'Eintreten', switching: 'Sprache wird umgestellt auf' },
    nav: { smash: 'Der Smash', menu: 'Karte', club: 'Burger Club', houses: 'Rosa Häuser', gallery: 'Galerie', reserve: 'Kostenlos reservieren', order: 'Bestellen', open: 'Menü öffnen', close: 'Menü schließen', lang: 'Sprache' },
    hero: {
      eyebrow: 'Smash Burger · Bucaramanga', l1: 'Don’t stress,', l2: 'feel fresco.',
      sub: 'Die frischesten Smash Burger, frisch auf der Grillplatte gepresst und in unseren zwei rosa Häusern serviert.',
      c1: 'Liefern lassen', c2: 'Kostenlos reservieren', c3: 'Zur Karte', open: 'Jetzt geöffnet', today: 'Heute ab', stickers: ['100 % Smash', 'Extra, extra!', 'Burger Club'],
    },
    tape: ['Don’t stress', 'Feel fresco', 'Smash Burger', 'Burger Club', 'Zwei rosa Häuser', 'Kostenlos reservieren'],
    smash: {
      eyebrow: 'So entsteht ein Smash', title: 'Kugel, Platte und Smash!',
      steps: [
        { t: 'Eine Kugel frisches Rind', d: 'Frisches Rindfleisch, täglich gewolft, zu einer Kugel mit genau dem richtigen Gewicht.' },
        { t: 'Smash! auf die Platte', d: 'Wir pressen sie kräftig auf die glühend heiße Grillplatte. Da passiert die Magie.' },
        { t: 'Goldene, knusprige Kruste', d: 'Die Ränder karamellisieren und werden knusprig, die Mitte bleibt saftig.' },
        { t: 'Geschmolzener Käse und fertig', d: 'Cheddar obendrauf, ein weiches Brötchen und direkt in deine Hände.' },
      ],
      hint: 'Weiter scrollen',
    },
    menu: {
      title: 'Die Karte', lead: 'Smash Burger, Pommes, Churros und Shakes. Tippe auf eine Kategorie oder sieh die ganze Karte mit Fotos.',
      full: 'Ganze Karte ansehen', back: 'Zur Startseite', picks: 'Die Lieblinge', fav: 'Liebling', hot: 'Scharf', veg: 'Vegetarisch',
      note: 'Richtpreise in kolumbianischen Pesos. Frag nach den neuesten Burger-Club-Kreationen.',
      cats: { burgers: 'Smash Burger', combos: 'Menüs', fries: 'Pommes', sweets: 'Churros & Desserts', shakes: 'Shakes', drinks: 'Getränke' },
    },
    club: {
      title: 'Werde Teil des Burger Club', lead: 'Neuheiten, „Last-Minute“-Editionen, Aktionen und alles aus den rosa Häusern, zuerst für den Club.',
      points: ['Neuheiten vor allen anderen', 'Aktionen nur für den Club', 'Blick hinter die Grillplatte'], cta: 'Dem Burger Club beitreten',
    },
    houses: {
      title: 'Unsere zwei rosa Häuser', lead: 'Wähle das nächste: komm essen, reserviere kostenlos oder bestelle per WhatsApp.',
      hours: 'Täglich von 18:00 bis 22:00 Uhr (am Wochenende bis 23:00 Uhr)',
      map: 'Route planen', domi: 'Lieferung per WhatsApp', open: 'Jetzt geöffnet', closed: 'Wir öffnen um 18:00 Uhr',
    },
    gal: { title: 'Frisch von innen', lead: 'Rosa Häuser, Palmen und Smash Burger.', close: 'Schließen', hint: 'Wischen zum Blättern' },
    res: {
      title: 'Kostenlos reservieren', lead: 'Wähle das Haus, den Tag und wie viele kommen. Wir bestätigen per Nachricht.',
      house: 'Haus', name: 'Name', namePh: 'Dein Name', date: 'Datum', time: 'Uhrzeit', people: 'Personen', one: 'Person', many: 'Personen',
      send: 'Per WhatsApp reservieren', sendIg: 'Per Instagram reservieren', copied: 'Nachricht kopiert. Füge sie im gerade geöffneten Instagram-Chat ein.',
      msg: (c, n, d, h, p) => `Hallo Feel Fresco! 🌴 Ich möchte im Haus ${c} reservieren.\nName: ${n}\nDatum: ${d}\nUhrzeit: ${h}\nPersonen: ${p}`,
    },
    foot: { rights: 'Alle Rechte vorbehalten.', top: 'Nach oben' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('ff_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return DICT[nav] ? nav : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('ff_lang', lang); } catch { /* sin almacenamiento */ }
  }, [lang]);
  const changeLang = useCallback((code) => {
    if (!DICT[code] || code === lang || switching) return;
    timers.current.forEach(clearTimeout);
    setSwitching(code);
    timers.current = [setTimeout(() => setLang(code), 900), setTimeout(() => setSwitching(null), 2000)];
  }, [lang, switching]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const pick = useCallback((arr) => (Array.isArray(arr) ? arr[IDX[lang]] ?? arr[1] ?? arr[0] : arr), [lang]);
  const value = useMemo(() => ({ lang, setLang: changeLang, switching, t: DICT[lang], pick, locale: LANGS[IDX[lang]].locale }), [lang, pick, changeLang, switching]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Enlace de domicilios de una casa: WhatsApp si hay número, si no el Linktree (ahí están sus líneas)
export const domiLink = (h) => (h.phone ? `https://wa.me/${h.phone}` : LINKTREE);

// Envía la reserva: WhatsApp de la casa elegida o, si no hay número, Instagram con el mensaje copiado
export async function sendMessage(text, phone) {
  if (phone) {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return 'wa';
  }
  try { await navigator.clipboard.writeText(text); } catch { /* sin portapapeles */ }
  window.open(`https://ig.me/m/${IG}`, '_blank', 'noopener');
  return 'ig';
}
