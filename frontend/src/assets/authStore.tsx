import { create } from 'zustand';
import {user} from "../types/user.ts";

interface AuthState {
    accessToken: string | null;
    user: user | null;
    login: (token: string, userData: user) => void;
    logout: () => void;
    setAccessToken: (token: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    // 상태를 변경하는 함수들
    login: (token, userData) => set({ accessToken: token, user: userData }),
    logout: () => set({ accessToken: null, user: null }),
    setAccessToken: (token) => set({ accessToken: token }),
}));

export default useAuthStore;