import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    build: {
        // Enable code splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'chart-vendor': ['recharts']
                }
            }
        },
        // Optimize build size
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true
            }
        },
        // Enable source maps in production for debugging
        sourcemap: false,
        // Chunk size warnings
        chunkSizeWarningLimit: 500,
        // Report compressed size
        reportCompressedSize: true
    },
    // Performance optimization
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'recharts']
    }
});
