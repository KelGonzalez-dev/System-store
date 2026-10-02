import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Dos páginas: el sitio (index.html) y la carta completa (carta.html), que funciona en cualquier hosting estático
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true, host: true },
  preview: { port: 3000 },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: { input: { main: resolve(__dirname, 'index.html'), carta: resolve(__dirname, 'carta.html') } },
  },
});
