import { create } from 'zustand';
import {user} from "../types/user.ts";

// 인증 상태 store의 shape 정의
interface AuthState {
    accessToken: string | null;
    user: user | null;
    // App.tsx의 초기 /auth/refresh 시도가 끝났는지 여부. 이게 true가 되기 전엔
    // accessToken이 null이어도 "로그인 안 됨"이 아니라 "아직 확인 중"임 — 이 플래그를
    // 안 보고 accessToken만으로 판단하면 새로고침 시 로그인된 사용자도 /login으로 튕겨나감.
    authChecked: boolean;
    login: (token: string, userData: user) => void;
    logout: () => void;
    setAccessToken: (token: string) => void;
    setAuthChecked: () => void;
}

// Zustand 기반 인증 스토어: accessToken/user, 로그인·로그아웃 액션을 전역으로 관리
const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    authChecked: false,
    // 상태를 변경하는 함수들
    login: (token, userData) => set({ accessToken: token, user: userData }),
    logout: () => set({ accessToken: null, user: null }),
    setAccessToken: (token) => set({ accessToken: token }),
    setAuthChecked: () => set({ authChecked: true }),
}));

export default useAuthStore;