import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite 프록시 설정을 통해 8080으로 전달됩니다.
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;