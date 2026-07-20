import { create } from 'zustand';
import api from '../api/axios';
import { WishlistItem } from '../types/wishlist';

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    addWishlist: (productId: number) => Promise<void>;
    removeWishlist: (productId: number) => Promise<void>;
    isWishlisted: (productId: number) => boolean;
}

// 찜(위시리스트) 스토어: 목록 조회, 추가/삭제 및 찜 여부 확인을 담당
const useWishlistStore = create<WishlistState>((set, get) => ({
    items: [],
    isLoading: false,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<WishlistItem[]>('/wishlist');
            set({ items: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    addWishlist: async (productId) => {
        await api.post(`/wishlist/${productId}`);
        await get().fetchWishlist();
    },

    removeWishlist: async (productId) => {
        await api.delete(`/wishlist/${productId}`);
        set({ items: get().items.filter(item => item.productId !== productId) });
    },

    // API 호출 없이 로컬 상태만으로 찜 여부를 동기 판단
    isWishlisted: (productId) => get().items.some(item => item.productId === productId),
}));

export default useWishlistStore;
