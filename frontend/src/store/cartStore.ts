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

    removeItems: async (cartItemIds) => {
        await Promise.all(cartItemIds.map((id) => api.delete(`/cart/items/${id}`)));
        set({ items: get().items.filter((item) => !cartItemIds.includes(item.cartItemId)) });
    },

    clearCart: () => set({ items: [] }),
}));

export default useCartStore;
