import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Acepta REACT_APP_API_URL (como antes) y VITE_API_URL en el .env
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: { port: 3000 },
  build: {
    outDir: 'build',
    assetsInlineLimit: 2048,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
});
