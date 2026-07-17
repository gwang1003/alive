import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';

// 토스페이먼츠 공식 문서에 공개된 테스트 클라이언트 키입니다. 실결제는 발생하지 않습니다.
// (가입 전 테스트용으로 누구나 사용 가능. 실서비스 전환 시 발급받은 상용 키로 교체 필요)
const TOSS_CLIENT_KEY = '***REMOVED***';

export async function requestTossPayment(params: {
    orderId: string;
    orderName: string;
    amount: number;
    customerName: string;
    customerEmail: string;
}) {
    const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
    const payment = tossPayments.payment({ customerKey: ANONYMOUS });

    await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: params.amount },
        orderId: params.orderId,
        orderName: params.orderName,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
    });
}
