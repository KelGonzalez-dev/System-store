export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#120D0A',
        brasa: '#E8641B',
        fuego: '#FF9A2E',
        oro: '#FFC447',
        azul: { DEFAULT: '#1F4FB5', claro: '#5B86F0', hondo: '#0F2C6B' },
        madera: '#3A2414',
        crema: '#F6EBD9',
      },
      fontFamily: {
        display: ['"Oswald Variable"', 'Impact', 'sans-serif'],
        script: ['Lobster', 'cursive'],
        slab: ['"Alfa Slab One"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
