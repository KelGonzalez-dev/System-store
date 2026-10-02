export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chicle: '#FF9BD3',
        rosa: { DEFAULT: '#F9A8D4', soft: '#FFD3EC' },
        rojo: '#E8323C',
        vino: '#8E0B18',
        amarillo: '#FFF59D',
        crema: '#FFF8EF',
        palma: '#2E9E5B',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        script: ['Yellowtail', '"Brush Script MT"', 'cursive'],
        sans: ['"DM Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
