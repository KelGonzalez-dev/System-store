export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#d7ae5d',
      },
      boxShadow: {
        glow: '0 40px 120px rgba(215, 170, 93, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(255,215,130,0.35), transparent 28%), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 10%)',
      },
    },
  },
  plugins: [],
}
