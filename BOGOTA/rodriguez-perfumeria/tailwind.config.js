export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050403',
        noir: '#0b0907',
        onyx: '#14100b',
        gold: { DEFAULT: '#d4af6a', light: '#f1d9a0', deep: '#8a6a2e' },
        ivory: '#f6efe2',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        cond: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        floaty: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-12px,0)' } },
        floaty2: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,10px,0)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        spinRev: { to: { transform: 'rotate(-360deg)' } },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        floaty2: 'floaty2 8s ease-in-out infinite',
        'spin-slow': 'spinSlow 60s linear infinite',
        'spin-rev': 'spinRev 90s linear infinite',
      },
    },
  },
  plugins: [],
};
