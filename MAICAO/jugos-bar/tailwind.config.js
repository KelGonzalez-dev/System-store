export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#62bf00', light: '#8fe02f', deep: '#3d8200', soft: '#e9f6d6' },
        ink: '#070906',
        s1: 'rgb(var(--s1) / <alpha-value>)',
        s2: 'rgb(var(--s2) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        inv: 'rgb(var(--inv) / <alpha-value>)',
        acc: 'rgb(var(--acc) / <alpha-value>)',
        coal: '#0e120c',
        leaf: '#161d12',
        paper: '#f7faf2',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        floaty: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-14px,0)' } },
        floaty2: { '0%,100%': { transform: 'translate3d(0,0,0) rotate(0)' }, '50%': { transform: 'translate3d(0,12px,0) rotate(6deg)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        floaty2: 'floaty2 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 28s linear infinite',
      },
    },
  },
  plugins: [({ addVariant }) => addVariant('lt', "[data-theme='light'] &")],
};
