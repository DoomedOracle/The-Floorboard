
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Vital for GitHub Pages subfolders
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
