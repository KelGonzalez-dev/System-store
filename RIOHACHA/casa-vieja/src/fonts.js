import '@fontsource-variable/playfair-display';
import '@fontsource-variable/caveat';
import '@fontsource-variable/manrope';
import playfairItalic from '@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2';

// Cursiva de Playfair (el paquete trae el archivo pero no su CSS)
if (typeof FontFace !== 'undefined') {
  const f = new FontFace('Playfair Display Variable', `url(${playfairItalic}) format('woff2')`, { style: 'italic', weight: '400 900', display: 'swap' });
  f.load().then((ff) => document.fonts.add(ff)).catch(() => {});
}
