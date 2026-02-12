import { create } from 'zustand';
import {user} from "../types/user.ts";

const useAuthStore = create((set) => ({
    accessToken: null,
    user: null,
    // 상태를 변경하는 함수들
    login: (token:string, userData:user) => set({ accessToken: token, user: userData }),
    logout: () => set({ accessToken: null, user: null }),
}));

export default useAuthStore;