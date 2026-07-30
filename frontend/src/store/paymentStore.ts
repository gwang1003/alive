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
    confirmPayment: (paymentKey: string, orderId: string) => Promise<PaymentConfirmResult>;
}

// 결제 스토어: 토스페이먼츠 결제 승인(confirm) 요청을 담당
const usePaymentStore = create<PaymentState>(() => ({
    // paymentKey/orderId만 전송 — 금액은 서버에서 주문 DB 값으로 확정
    confirmPayment: async (paymentKey, orderId) => {
        const response = await api.post<PaymentConfirmResult>('/payments/confirm', {
            paymentKey,
            orderId,
        });
        return response.data;
    },
}));

export default usePaymentStore;
