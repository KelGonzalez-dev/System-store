export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#1B120D',
        cafe: '#3B2418',
        crema: '#F4EBDD',
        papel: '#FAF5EC',
        dorado: '#D9A54A',
        vino: '#8E1B1B',
        azul: { DEFAULT: '#1F4E9E', hondo: '#132F63' },
        noche: '#0E1426',
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        hand: ['"Caveat Variable"', 'cursive'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
