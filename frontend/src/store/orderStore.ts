import { create } from 'zustand';
import api from '../api/axios';
import { Order, OrderCreateRequest } from '../types/order';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    createOrder: (request: OrderCreateRequest) => Promise<Order>;
    fetchOrders: () => Promise<void>;
    fetchOrderDetail: (orderId: number) => Promise<Order>;
    cancelOrder: (orderId: number) => Promise<Order>;
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

    cancelOrder: async (orderId) => {
        const response = await api.patch<Order>(`/orders/${orderId}/cancel`);
        set({ orders: get().orders.map((o) => (o.orderId === orderId ? response.data : o)) });
        return response.data;
    },
}));

export default useOrderStore;
