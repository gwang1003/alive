import { create } from 'zustand';
import api from '../api/axios';

export interface RestockNotification {
    restockNotificationId: number;
    stockId: number;
    notified: boolean;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    color: string;
    size: string;
    createdAt: string;
}

interface RestockState {
    notifications: RestockNotification[];
    requestNotification: (stockId: number) => Promise<void>;
    cancelNotification: (stockId: number) => Promise<void>;
    checkRequested: (stockId: number) => Promise<boolean>;
    fetchMyNotifications: () => Promise<void>;
}

const useRestockStore = create<RestockState>((set, get) => ({
    notifications: [],

    requestNotification: async (stockId) => {
        await api.post(`/restock-notifications/${stockId}`);
    },

    cancelNotification: async (stockId) => {
        await api.delete(`/restock-notifications/${stockId}`);
        set({ notifications: get().notifications.filter((n) => n.stockId !== stockId) });
    },

    checkRequested: async (stockId) => {
        const response = await api.get<boolean>(`/restock-notifications/${stockId}`);
        return response.data;
    },

    fetchMyNotifications: async () => {
        const response = await api.get<RestockNotification[]>('/restock-notifications');
        set({ notifications: response.data });
    },
}));

export default useRestockStore;
