import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // swc 제거

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8282',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})