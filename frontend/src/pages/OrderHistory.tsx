import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../assets/authStore';

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

const OrderHistory: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { orders, isLoading, fetchOrders, cancelOrder } = useOrderStore();

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    const handleCancel = async (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        if (!window.confirm('이 주문을 취소하시겠습니까?')) return;
        try {
            await cancelOrder(orderId);
        } catch (err: any) {
            alert(err.response?.data?.message ?? '주문 취소에 실패했습니다');
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-12">주문내역</h1>

                {isLoading && orders.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}

                {!isLoading && orders.length === 0 && (
                    <p className="text-ink-soft text-center py-32">주문 내역이 없습니다.</p>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="border border-line rounded-2xl p-8 cursor-pointer hover:border-coral transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-xs font-bold text-ink-soft">{order.orderNumber}</p>
                                    <p className="text-xs text-ink-soft">{new Date(order.orderedAt).toLocaleString('ko-KR')}</p>
                                </div>
                                <span
                                    className="text-[10px] font-black uppercase tracking-widest"
                                    style={{ color: STATUS_COLOR[order.status] ?? '#746657' }}
                                >
                                    {STATUS_LABEL[order.status] ?? order.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {order.items.map((item, i) => (
                                    <p key={i} className="text-sm text-ink-soft">
                                        {item.productName} ({item.color}/{item.size}) × {item.quantity}
                                    </p>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                {(order.status === 'PENDING' || order.status === 'PAID') && (
                                    <button
                                        onClick={(e) => handleCancel(e, order.orderId)}
                                        className="text-[11px] font-bold text-coral-deep hover:underline"
                                    >
                                        주문취소
                                    </button>
                                )}
                                <p className="text-right text-sm font-black text-ink ml-auto">
                                    {order.finalAmount.toLocaleString()} KRW
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
