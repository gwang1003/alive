import { create } from 'zustand';
import api from '../api/axios';

interface RestockState {
    requestNotification: (stockId: number) => Promise<void>;
    cancelNotification: (stockId: number) => Promise<void>;
    checkRequested: (stockId: number) => Promise<boolean>;
}

const useRestockStore = create<RestockState>(() => ({
    requestNotification: async (stockId) => {
        await api.post(`/restock-notifications/${stockId}`);
    },

    cancelNotification: async (stockId) => {
        await api.delete(`/restock-notifications/${stockId}`);
    },

    checkRequested: async (stockId) => {
        const response = await api.get<boolean>(`/restock-notifications/${stockId}`);
        return response.data;
    },
}));

export default useRestockStore;
