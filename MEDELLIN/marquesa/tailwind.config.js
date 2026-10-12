export default {
  content: ['./index.html', './carta.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noche: { DEFAULT: '#0C0A0E', 2: '#141118', 3: '#1E1924' },
        rosa: { DEFAULT: '#F6A9D4', soft: '#FBD3EA', deep: '#E989BF' },
        neon: '#FF4FA3',
        magenta: '#E5007E',
        lila: '#8E5CFF',
        hueso: '#FFF3FA',
      },
      fontFamily: {
        display: ['"Big Shoulders Display Variable"', 'Impact', '"Arial Narrow"', 'sans-serif'],
        script: ['Sacramento', '"Brush Script MT"', 'cursive'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
