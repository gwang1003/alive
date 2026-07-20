import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// TossPayments 결제창에서 실패/취소로 리다이렉트됐을 때 표시되는 페이지 (풀 페이지 리로드로 진입)
const PaymentFail: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') ?? '결제가 취소되었거나 실패했습니다.';

    return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-sm font-bold text-coral-deep">{message}</p>
            <p className="text-xs text-ink-soft">주문은 결제 대기 상태로 남아있어요. 주문내역에서 다시 시도하거나 취소할 수 있습니다.</p>
            <div className="flex gap-3">
                <button
                    onClick={() => navigate('/orders')}
                    className="px-8 py-3 bg-ink text-white text-xs font-black tracking-widest uppercase rounded-full hover:opacity-80 transition-all"
                >
                    주문내역 보기
                </button>
                <button
                    onClick={() => navigate('/cart')}
                    className="px-8 py-3 border border-line text-ink text-xs font-black tracking-widest uppercase rounded-full hover:border-ink transition-all"
                >
                    장바구니로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default PaymentFail;
