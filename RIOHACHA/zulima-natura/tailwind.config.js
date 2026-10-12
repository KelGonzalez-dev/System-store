export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { bosque: '#2F4A3A', salvia: '#7C9A7E', terra: '#C8693F', nude: '#E9C9B9', dorado: '#C9A25F', crema: '#FBF5EE' },
      fontFamily: {
        display: ['Gloock', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        sans: ['"Outfit Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
