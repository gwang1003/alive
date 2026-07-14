import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';
import { OrderStatus } from '../../types/order';
import AdminNav from '../../components/AdminNav';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '주문 접수',
    PAID: '결제 완료',
    SHIPPING: '배송 중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소',
};

const STATUS_OPTIONS: (OrderStatus | '')[] = ['', 'PENDING', 'PAID', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

const AdminOrderList: React.FC = () => {
    const navigate = useNavigate();
    const { orders, orderTotalPages, orderPage, isLoading, fetchOrders } = useAdminStore();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

    useEffect(() => {
        fetchOrders(0, statusFilter || undefined);
    }, [statusFilter]);

    return (
        <div className="min-h-screen bg-canvas px-12 py-16">
            <div className="max-w-6xl mx-auto">
                <AdminNav />
                <div className="flex justify-between items-center mb-10">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">주문 관리</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                        className="border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status ? STATUS_LABEL[status] : '전체'}</option>
                        ))}
                    </select>
                </div>

                {isLoading && orders.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && orders.length === 0 && (
                    <p className="text-ink-soft text-center py-32">주문이 없습니다.</p>
                )}

                <table className="w-full text-sm">
                    <thead className="bg-line/30 text-ink-soft font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="py-4 px-4 text-left">주문번호</th>
                            <th className="py-4 px-4">수령인</th>
                            <th className="py-4 px-4">상태</th>
                            <th className="py-4 px-4">총액</th>
                            <th className="py-4 px-4">주문일</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {orders.map((order) => (
                            <tr
                                key={order.orderId}
                                onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                                className="hover:bg-surface cursor-pointer"
                            >
                                <td className="py-4 px-4 font-bold text-ink">{order.orderNumber}</td>
                                <td className="py-4 px-4 text-center">{order.recipientName}</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="text-[10px] font-black text-[#1D6478] uppercase tracking-widest">
                                        {STATUS_LABEL[order.status] ?? order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center font-black">{order.finalAmount.toLocaleString()}원</td>
                                <td className="py-4 px-4 text-center text-ink-soft">
                                    {new Date(order.orderedAt).toLocaleDateString('ko-KR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orderTotalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: orderTotalPages }, (_, n) => n).map((n) => (
                            <button
                                key={n}
                                onClick={() => fetchOrders(n, statusFilter || undefined)}
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === orderPage ? 'bg-coral text-white' : 'text-ink-soft hover:bg-surface'}`}
                            >
                                {n + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderList;
