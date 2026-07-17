import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import usePaymentStore from '../store/paymentStore';
import useAuthStore from '../assets/authStore';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { confirmPayment } = usePaymentStore();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const [error, setError] = useState('');

    useEffect(() => {
        // Toss 결제창에서 돌아오는 이 페이지는 새로고침(풀 리로드)으로 열리기 때문에,
        // 메모리에만 있는 accessToken이 비어있는 상태로 시작한다. App.tsx의 초기 /auth/refresh가
        // 끝나기 전에 결제 승인을 요청하면 인증 없이 요청이 나가 실패하므로, 로그인 확인이
        // 끝날 때까지(authChecked) 기다렸다가 승인 요청을 보낸다.
        if (!authChecked) return;

        if (!accessToken) {
            setError('로그인이 만료되었습니다. 다시 로그인 후 주문내역에서 결제 상태를 확인해주세요.');
            return;
        }

        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
            setError('결제 정보가 올바르지 않습니다.');
            return;
        }

        const confirm = async () => {
            try {
                const result = await confirmPayment(paymentKey, orderId, Number(amount));
                navigate(`/orders/${result.orderId}`, { replace: true });
            } catch (err: any) {
                setError(err.response?.data?.message ?? '결제 승인 중 오류가 발생했습니다.');
            }
        };
        confirm();
    }, [searchParams, authChecked, accessToken]);

    return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-6 px-6 text-center">
            {error ? (
                <>
                    <p className="text-sm font-bold text-coral-deep">{error}</p>
                    <button
                        onClick={() => navigate('/cart')}
                        className="px-8 py-3 bg-ink text-white text-xs font-black tracking-widest uppercase rounded-full hover:opacity-80 transition-all"
                    >
                        장바구니로 돌아가기
                    </button>
                </>
            ) : (
                <p className="text-sm font-bold text-ink-soft">결제를 승인하는 중입니다...</p>
            )}
        </div>
    );
};

export default PaymentSuccess;
