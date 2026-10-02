/** Colores tomados directamente del logo y del banner de Tres Raíces */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#023714', // verde profundo del logo
        ink: '#0a330b', // verde del texto del banner
        leaf: '#2b661b', // verde medio
        fern: '#50841f', // verde hoja
        lime: '#75a32a', // verde claro
        berry: { DEFAULT: '#c90e1e', dark: '#860108' }, // cereza del café
        gold: { DEFAULT: '#df8b10', light: '#fcbe39' }, // mazorca de cacao
        bark: '#8e4201', // tallo de la mazorca
        cream: '#f6f3ea',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Figtree', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        floaty: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-14px,0)' } },
        ping2: { '0%': { transform: 'scale(1)', opacity: '.5' }, '100%': { transform: 'scale(1.9)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        ping2: 'ping2 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
