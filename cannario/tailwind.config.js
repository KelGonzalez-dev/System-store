export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        stone: { DEFAULT: '#E8E6E2', soft: '#F3F2EF', deep: '#D8D5CF' },
        ash: { DEFAULT: '#2E2D2B', deep: '#1F1E1D', soft: '#43413E' },
        gold: { DEFAULT: '#C9962F', light: '#E4C07A', dark: '#9A7020' },
        ink: '#252422',
        mute: '#76736D',
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', '"Bodoni Moda"', '"Didot"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk Variable"', '"Hanken Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
