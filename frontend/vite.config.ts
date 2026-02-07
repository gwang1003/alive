import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // SWC 사용 시

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // 리액트 포트를 3000으로 고정 (선택사항)
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // Java 백엔드 주소
                changeOrigin: true,
                secure: false,
            }
        }
    }
})