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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    if (!order) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-xs font-black text-blue-600 tracking-widest uppercase mb-2">
                        {STATUS_LABEL[order.status] ?? order.status}
                    </p>
                    <h1 className="text-3xl font-black tracking-tighter">주문이 완료되었습니다</h1>
                    <p className="text-sm text-gray-400 mt-2">주문번호 {order.orderNumber}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                    <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-4">배송 정보</h2>
                    <p className="text-sm font-bold text-gray-900">{order.recipientName} · {order.recipientPhone}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                    {order.deliveryMessage && (
                        <p className="text-sm text-gray-400 mt-1">{order.deliveryMessage}</p>
                    )}
                </div>

                <div className="divide-y divide-gray-100 border-y border-gray-900">
                    {order.items.map((item, i) => (
                        <div key={i} className="py-6 flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                    {item.thumbnailUrl && (
                                        <img src={`/api${item.thumbnailUrl}`} alt={item.productName} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                                    <p className="text-xs text-gray-400">{item.color} / {item.size} × {item.quantity}</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-gray-900">{item.subtotal.toLocaleString()} KRW</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>상품 금액</span>
                        <span>{order.totalAmount.toLocaleString()} KRW</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>배송비</span>
                        <span>{order.deliveryFee.toLocaleString()} KRW</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
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
                            className="flex-1 h-14 border border-red-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                            주문 취소
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex-1 h-14 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        주문내역 보기
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 h-14 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
