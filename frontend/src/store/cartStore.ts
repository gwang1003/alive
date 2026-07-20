import { create } from 'zustand';
import api from '../api/axios';
import { CartItem } from '../types/cart';

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (stockId: number, quantity: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    removeItems: (cartItemIds: number[]) => Promise<void>;
    clearCart: () => void;
}

// 장바구니 스토어: 목록 조회, 담기/수량변경/삭제 및 로컬 초기화(clearCart)를 담당
const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<CartItem[]>('/cart');
            set({ items: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (stockId, quantity) => {
        await api.post('/cart/items', { stockId, quantity });
        await get().fetchCart();
    },

    updateQuantity: async (cartItemId, quantity) => {
        await api.patch(`/cart/items/${cartItemId}`, { quantity });
        await get().fetchCart();
    },

    removeItem: async (cartItemId) => {
        await api.delete(`/cart/items/${cartItemId}`);
        set({ items: get().items.filter(item => item.cartItemId !== cartItemId) });
    },

    // 여러 항목을 병렬로 삭제 요청 후 로컬 상태에서 필터링(서버 재조회 없음)
    removeItems: async (cartItemIds) => {
        await Promise.all(cartItemIds.map((id) => api.delete(`/cart/items/${id}`)));
        set({ items: get().items.filter((item) => !cartItemIds.includes(item.cartItemId)) });
    },

    clearCart: () => set({ items: [] }),
}));

export default useCartStore;
