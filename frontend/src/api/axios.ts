import axios from 'axios';
import useAuthStore from "../assets/authStore.tsx";
import useCartStore from "../store/cartStore";

// 공통 axios 인스턴스: 액세스 토큰 자동 첨부, 401 발생 시 토큰 재발급 후 원 요청 재시도까지 처리
const api = axios.create({
    // 로컬: '/api'(Vite 프록시 → localhost 백엔드). 배포: VITE_API_URL에 백엔드 절대 URL 지정
    // (예: https://alive-backend.up.railway.app/api)
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ⭐ Cookie 전송 허용 (중요!)
});

// api 호출 시 인터셉트하여 토큰 검증해서 넣어주는 부분
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// 리프레시 토큰은 1회용(회전) 방식이라, 여러 곳(App.tsx 초기 로그인 복구, 아래 401 재시도 등)에서
// 동시에 /auth/refresh를 부르면 먼저 도착한 요청만 성공하고 나머지는 이미 회전된 토큰으로 실패한다.
// 진행 중인 재발급 요청을 하나로 공유해서 이 레이스를 막는다.
let refreshPromise: Promise<{ accessToken: string; user: any }> | null = null;

export function refreshAuth() {
    if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh')
            .then((response) => response.data)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러(인증 만료)가 났고, 재시도한 적이 없다면
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. 토큰 재발급 요청 (다른 곳에서 이미 진행 중이면 그 결과를 같이 사용)
                const { accessToken } = await refreshAuth();

                // 2. 새로운 토큰을 Zustand 스토어에 저장 (다음 요청부터 이 토큰을 사용)
                useAuthStore.getState().setAccessToken(accessToken);

                // 3. 원래 실패했던 요청의 헤더를 새 토큰으로 교체 후 재요청
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (reissueError) {
                // RefreshToken마저 만료된 경우 -> 로그아웃 처리
                useAuthStore.getState().logout();
                useCartStore.getState().clearCart();
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;