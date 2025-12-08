// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  
  // Оптимизация для Tauri
  build: {
    target: 'es2020',
    minify: false, // Отключите минификацию для отладки
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
  
  server: {
    port: 5173,
    strictPort: true,
  },
  
  clearScreen: false,
})