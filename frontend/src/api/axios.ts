import axios from 'axios';
import useAuthStore from "../assets/authStore.tsx";

const api = axios.create({
    baseURL: '/api', // Vite 프록시 설정을 통해 8080으로 전달됩니다.
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ⭐ Cookie 전송 허용 (중요!)
});

// api 호출 시 인터셉트하여 토큰 검증해서 넣어주는 부분
api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('accessToken');
    const token = useAuthStore.getState().accessToken;
    console.log(useAuthStore)
    console.log(token)
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러(인증 만료)가 났고, 재시도한 적이 없다면
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. 토큰 재발급 요청
                const response = await api.post('/auth/refresh');
                const { accessToken } = response.data;

                // 2. 새로운 토큰을 Zustand나 메모리에 저장
                // useAuthStore.getState().setAccessToken(accessToken);

                // 3. 원래 실패했던 요청의 헤더를 새 토큰으로 교체 후 재요청
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (reissueError) {
                // RefreshToken마저 만료된 경우 -> 로그아웃 처리
                useAuthStore.getState().logout();
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;