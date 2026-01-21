
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    // Shims process.env to prevent "process is not defined" errors in the browser
    'process.env': {}
  }
});
