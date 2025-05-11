import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        setupFiles: ['./src/tests/setup.js'],
        environment: 'jsdom'
    },
    preview: {
        port: '4569'
    },
    server: {
        port: '3567'
    }
})
