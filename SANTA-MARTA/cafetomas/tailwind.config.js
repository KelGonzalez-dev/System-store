export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { morado: '#972584', amarillo: '#FFC70C', naranja: '#F45B1B', crema: '#FFF5E6', cafe: '#2A1610' },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
