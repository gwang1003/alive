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

const OrderHistory: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { orders, isLoading, fetchOrders } = useOrderStore();

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

    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black tracking-tighter mb-12">주문내역</h1>

                {isLoading && orders.length === 0 && <p className="text-sm text-gray-400">불러오는 중...</p>}

                {!isLoading && orders.length === 0 && (
                    <p className="text-gray-400 text-center py-32">주문 내역이 없습니다.</p>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="border border-gray-100 rounded-2xl p-8 cursor-pointer hover:border-gray-300 transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400">{order.orderNumber}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.orderedAt).toLocaleString('ko-KR')}</p>
                                </div>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                    {STATUS_LABEL[order.status] ?? order.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {order.items.map((item, i) => (
                                    <p key={i} className="text-sm text-gray-700">
                                        {item.productName} ({item.color}/{item.size}) × {item.quantity}
                                    </p>
                                ))}
                            </div>
                            <p className="text-right text-sm font-black text-gray-900 mt-4">
                                {order.finalAmount.toLocaleString()} KRW
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
