export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noir: '#0B0A08',
        carbon: '#15130F',
        oro: '#C9A35A',
        crema: '#F3EAD8',
        verde: '#0F2A1F',
        coral: '#E9785A',
      },
      fontFamily: {
        belo: ['Oranienbaum', 'Didot', 'serif'],
        caps: ['"Cinzel Variable"', 'Trajan Pro', 'serif'],
        display: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
