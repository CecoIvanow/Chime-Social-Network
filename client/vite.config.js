import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        coverage: {
            all: true,
            provider: 'istanbul',
            extension: ['.js', '.jsx'],
            exclude: ['src/main.jsx']
        },
        setupFiles: ['./src/tests/setup.js'],
        environment: 'jsdom',
    },
    preview: {
        port: '4569',
        host: '0.0.0.0',
    },
    server: {
        port: '3567',
        host: '0.0.0.0',
        watch: {
            usePolling: true,
            interval: 500,
        }
    }
})
