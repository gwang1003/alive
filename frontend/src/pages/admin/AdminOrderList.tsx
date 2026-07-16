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
const STATUS_VALUES: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

const AdminOrderList: React.FC = () => {
    const navigate = useNavigate();
    const { orders, orderTotalPages, orderPage, isLoading, fetchOrders, updateOrderStatusBulk } = useAdminStore();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkStatus, setBulkStatus] = useState<OrderStatus>('PAID');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    useEffect(() => {
        fetchOrders(0, statusFilter || undefined);
        setSelectedIds(new Set());
    }, [statusFilter]);

    const toggleSelect = (orderId: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) next.delete(orderId);
            else next.add(orderId);
            return next;
        });
    };

    const allSelected = orders.length > 0 && selectedIds.size === orders.length;
    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? new Set() : new Set(orders.map((o) => o.orderId)));
    };

    const handleBulkUpdate = async () => {
        if (selectedIds.size === 0) return;
        setIsBulkUpdating(true);
        try {
            await updateOrderStatusBulk([...selectedIds], bulkStatus);
            await fetchOrders(orderPage, statusFilter || undefined);
            setSelectedIds(new Set());
        } catch (err: any) {
            alert(err.response?.data?.message ?? '일괄 상태 변경에 실패했습니다');
        } finally {
            setIsBulkUpdating(false);
        }
    };

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

                {selectedIds.size > 0 && (
                    <div className="flex items-center gap-4 mb-4 p-4 bg-surface border border-line rounded-xl">
                        <span className="text-xs font-bold text-ink-soft">{selectedIds.size}건 선택됨</span>
                        <select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
                            className="border-b-2 border-line py-1 text-sm font-bold outline-none bg-transparent"
                        >
                            {STATUS_VALUES.map((status) => (
                                <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleBulkUpdate}
                            disabled={isBulkUpdating}
                            className="px-6 py-2 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            {isBulkUpdating ? '변경 중...' : '선택 항목 상태 변경'}
                        </button>
                    </div>
                )}

                {isLoading && orders.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && orders.length === 0 && (
                    <p className="text-ink-soft text-center py-32">주문이 없습니다.</p>
                )}

                {orders.length > 0 && (
                    <table className="w-full text-sm">
                        <thead className="bg-line/30 text-ink-soft font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="py-4 px-4 w-10">
                                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                                </th>
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
                                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(order.orderId)}
                                            onChange={() => toggleSelect(order.orderId)}
                                        />
                                    </td>
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
                )}

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
