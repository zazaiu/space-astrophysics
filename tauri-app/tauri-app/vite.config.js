import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    base: './', // или оставьте пустым ''
    build: {
        // Настройки для сборки
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2020',
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]'
            }
        }
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/images': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                secure: false,
                rewrite: function (path) { return path.replace(/^\/images/, '/space-images'); }
            }
        }
    }
});
