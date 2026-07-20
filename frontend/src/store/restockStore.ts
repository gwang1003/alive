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

// 재입고 알림 스토어: 품절 옵션에 대한 재입고 알림 신청/취소/조회를 담당
const useRestockStore = create<RestockState>((set, get) => ({
    notifications: [],

    requestNotification: async (stockId) => {
        await api.post(`/restock-notifications/${stockId}`);
    },

    cancelNotification: async (stockId) => {
        await api.delete(`/restock-notifications/${stockId}`);
        set({ notifications: get().notifications.filter((n) => n.stockId !== stockId) });
    },

    // 해당 옵션에 대해 이미 알림을 신청했는지 여부 확인
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
