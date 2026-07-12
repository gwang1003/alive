import { create } from 'zustand';
import api from '../api/axios';
import { Order, OrderCreateRequest } from '../types/order';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    createOrder: (request: OrderCreateRequest) => Promise<Order>;
    fetchOrders: () => Promise<void>;
    fetchOrderDetail: (orderId: number) => Promise<Order>;
}

const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,

    createOrder: async (request) => {
        const response = await api.post<Order>('/orders', request);
        return response.data;
    },

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<Order[]>('/orders');
            set({ orders: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrderDetail: async (orderId) => {
        const response = await api.get<Order>(`/orders/${orderId}`);
        return response.data;
    },
}));

export default useOrderStore;
