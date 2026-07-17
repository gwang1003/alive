import { create } from 'zustand';
import api from '../api/axios';

export interface PaymentConfirmResult {
    orderId: number;
    orderNumber: string;
    method: string;
    amount: number;
    receiptUrl: string | null;
    approvedAt: string;
}

interface PaymentState {
    confirmPayment: (paymentKey: string, orderId: string, amount: number) => Promise<PaymentConfirmResult>;
}

const usePaymentStore = create<PaymentState>(() => ({
    confirmPayment: async (paymentKey, orderId, amount) => {
        const response = await api.post<PaymentConfirmResult>('/payments/confirm', {
            paymentKey,
            orderId,
            amount,
        });
        return response.data;
    },
}));

export default usePaymentStore;
