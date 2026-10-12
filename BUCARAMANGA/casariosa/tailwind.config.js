export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#120705',
        coal: '#1c0c09',
        wine: { DEFAULT: '#8c1d22', dark: '#5c1015', light: '#b8333a' },
        cream: '#fbf3e7',
        paper: '#fffaf1',
        gold: { DEFAULT: '#c6a15b', light: '#e6c98a', dark: '#8f732f' },
        basil: '#4b5a3a',
        ink: '#241310',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        body: ['"Mulish"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        floaty: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-12px,0)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
