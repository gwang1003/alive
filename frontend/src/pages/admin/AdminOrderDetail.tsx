import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';
import { Order, OrderStatus } from '../../types/order';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '주문 접수',
    PAID: '결제 완료',
    SHIPPING: '배송 중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소',
};

const STATUS_VALUES: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

const AdminOrderDetail: React.FC = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { fetchOrderDetail, updateOrderStatus } = useAdminStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');

    const load = async () => {
        const detail = await fetchOrderDetail(Number(orderId));
        setOrder(detail);
        setSelectedStatus(detail.status);
    };

    useEffect(() => {
        load();
    }, [orderId]);

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        setMessage('');
        try {
            await updateOrderStatus(Number(orderId), selectedStatus);
            await load();
            setMessage('상태가 변경되었습니다');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!order) {
        return <div className="min-h-screen bg-white px-12 py-16 text-sm text-gray-400">불러오는 중...</div>;
    }

    return (
        <div className="min-h-screen bg-white px-12 py-16">
            <div className="max-w-2xl mx-auto space-y-8">
                <button onClick={() => navigate('/admin/orders')} className="text-xs font-bold text-gray-400 hover:text-gray-900">
                    ← 목록으로
                </button>

                <div>
                    <h1 className="text-2xl font-black tracking-tighter">{order.orderNumber}</h1>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.orderedAt).toLocaleString('ko-KR')}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-2 text-sm">
                    <p><span className="font-bold text-gray-500">수령인</span> {order.recipientName} ({order.recipientPhone})</p>
                    <p><span className="font-bold text-gray-500">배송지</span> {order.deliveryAddress}</p>
                    {order.deliveryMessage && <p><span className="font-bold text-gray-500">메시지</span> {order.deliveryMessage}</p>}
                </div>

                <div className="space-y-2">
                    {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-gray-700">
                            {item.productName} ({item.color}/{item.size}) × {item.quantity} — {item.subtotal.toLocaleString()}원
                        </p>
                    ))}
                </div>
                <p className="text-right text-lg font-black text-gray-900">{order.finalAmount.toLocaleString()}원</p>

                <div className="flex items-end gap-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">주문 상태</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                            className="border-b-2 border-gray-100 py-2 text-sm font-bold outline-none bg-transparent"
                        >
                            {STATUS_VALUES.map((status) => (
                                <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={isUpdating || selectedStatus === order.status}
                        className="px-6 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50"
                    >
                        상태 변경
                    </button>
                    {message && <span className="text-xs font-bold text-green-600">{message}</span>}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
