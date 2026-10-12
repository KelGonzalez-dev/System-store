export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { choco: '#4A2C20', crema: '#F3ECE2', amarillo: '#F6D94A', fresa: '#D7263D', pistacho: '#B7C98A' },
      fontFamily: {
        display: ['Marcellus', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
