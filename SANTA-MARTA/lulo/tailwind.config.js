export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#140200',
        coal: '#1f0703',
        ember: { DEFAULT: '#d84c0a', light: '#ff7a2f', deep: '#993513' },
        wood: { 1: '#cd4b17', 2: '#993513', 3: '#691b08' },
        neon: '#fcfaef',
      },
      fontFamily: {
        display: ['Jost', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        floaty: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-12px,0)' } },
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
