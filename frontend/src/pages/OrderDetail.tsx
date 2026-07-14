import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import { Order } from '../types/order';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '주문 접수',
    PAID: '결제 완료',
    SHIPPING: '배송 중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소',
};

const STATUS_COLOR: Record<string, string> = {
    PENDING: '#746657',
    PAID: '#1D6478',
    SHIPPING: '#8A5A05',
    DELIVERED: '#5B7A3A',
    CANCELLED: '#E24F2C',
};

const OrderDetail: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { fetchOrderDetail, cancelOrder } = useOrderStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchOrderDetail(Number(orderId));
                setOrder(data);
            } catch (err: any) {
                setError(err.response?.data?.message ?? '주문 정보를 불러올 수 없습니다.');
            }
        };
        load();
    }, [orderId]);

    const handleCancel = async () => {
        if (!window.confirm('이 주문을 취소하시겠습니까?')) return;
        setCancelError('');
        setCancelling(true);
        try {
            const updated = await cancelOrder(Number(orderId));
            setOrder(updated);
        } catch (err: any) {
            setCancelError(err.response?.data?.message ?? '주문 취소에 실패했습니다');
        } finally {
            setCancelling(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <p className="text-ink-soft">{error}</p>
            </div>
        );
    }

    if (!order) {
        return <div className="min-h-screen bg-canvas" />;
    }

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p
                        className="text-xs font-black tracking-widest uppercase mb-2"
                        style={{ color: STATUS_COLOR[order.status] ?? '#746657' }}
                    >
                        {STATUS_LABEL[order.status] ?? order.status}
                    </p>
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">주문이 완료되었습니다</h1>
                    <p className="text-sm text-ink-soft mt-2">주문번호 {order.orderNumber}</p>
                </div>

                <div className="bg-surface border border-line rounded-2xl p-8 mb-8">
                    <h2 className="text-xs font-black text-ink-soft tracking-widest uppercase mb-4">배송 정보</h2>
                    <p className="text-sm font-bold text-ink">{order.recipientName} · {order.recipientPhone}</p>
                    <p className="text-sm text-ink-soft mt-1">{order.deliveryAddress}</p>
                    {order.deliveryMessage && (
                        <p className="text-sm text-ink-soft mt-1">{order.deliveryMessage}</p>
                    )}
                </div>

                <div className="divide-y divide-line border-y border-ink">
                    {order.items.map((item, i) => (
                        <div key={i} className="py-6 flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-canvas rounded-2xl overflow-hidden shrink-0">
                                    {item.thumbnailUrl && (
                                        <img src={`/api${item.thumbnailUrl}`} alt={item.productName} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-ink">{item.productName}</p>
                                    <p className="text-xs text-ink-soft">{item.color} / {item.size} × {item.quantity}</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-ink">{item.subtotal.toLocaleString()} KRW</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-sm text-ink-soft">
                        <span>상품 금액</span>
                        <span>{order.totalAmount.toLocaleString()} KRW</span>
                    </div>
                    <div className="flex justify-between text-sm text-ink-soft">
                        <span>배송비</span>
                        <span>{order.deliveryFee.toLocaleString()} KRW</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-ink pt-2 border-t border-line">
                        <span>총 결제 금액</span>
                        <span>{order.finalAmount.toLocaleString()} KRW</span>
                    </div>
                </div>

                {cancelError && <p className="text-xs font-bold text-red-500 mt-4">{cancelError}</p>}

                <div className="flex gap-4 mt-12">
                    {(order.status === 'PENDING' || order.status === 'PAID') && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="flex-1 h-14 border border-coral/30 text-coral-deep rounded-full text-xs font-black uppercase tracking-widest hover:bg-coral/5 transition-all disabled:opacity-50"
                        >
                            주문 취소
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex-1 h-14 border border-line rounded-full text-xs font-black uppercase tracking-widest hover:bg-surface transition-all"
                    >
                        주문내역 보기
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 h-14 bg-coral text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-coral-deep transition-all"
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
