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

// 결제 스토어: 토스페이먼츠 결제 승인(confirm) 요청을 담당
const usePaymentStore = create<PaymentState>(() => ({
    // 결제창에서 받은 paymentKey/orderId/amount로 서버에 결제 승인을 요청
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
