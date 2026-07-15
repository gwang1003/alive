import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../assets/authStore';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    // 지금까지 한 번이라도 봤던 cartItemId 목록. 수량 변경처럼 items가 갱신될 때마다
    // "선택 안 된 상태"를 "새로 담긴 항목"으로 착각해 다시 체크해버리는 걸 막기 위해 씀
    const knownIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [authChecked, accessToken]);

    // 장바구니가 갱신될 때: 삭제된 항목은 선택 해제하고, 진짜 새로 담긴 항목만 기본 선택 상태로 둠
    // (수량 변경 등으로 기존 항목이 갱신되는 것과 "새로 담긴 항목"을 구분해야 함)
    useEffect(() => {
        const currentIds = new Set(items.map((item) => item.cartItemId));
        setSelectedIds((prev) => {
            const next = new Set([...prev].filter((id) => currentIds.has(id)));
            items.forEach((item) => {
                if (!knownIdsRef.current.has(item.cartItemId)) next.add(item.cartItemId);
            });
            return next;
        });
        knownIdsRef.current = currentIds;
    }, [items]);

    const toggleSelect = (cartItemId: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(cartItemId)) next.delete(cartItemId);
            else next.add(cartItemId);
            return next;
        });
    };

    const allSelected = items.length > 0 && selectedIds.size === items.length;
    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? new Set() : new Set(items.map((item) => item.cartItemId)));
    };

    const selectedItems = items.filter((item) => selectedIds.has(item.cartItemId));
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

    if (!authChecked || !accessToken) {
        return null;
    }

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItemIds: [...selectedIds] } });
    };

    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black tracking-tighter mb-12">Shopping Cart</h1>

                {isLoading && items.length === 0 && (
                    <p className="text-sm text-gray-400">불러오는 중...</p>
                )}

                {!isLoading && items.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-gray-400 mb-6">장바구니가 비어있습니다.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-gray-900 text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-black transition-all"
                        >
                            쇼핑 계속하기
                        </button>
                    </div>
                )}

                {items.length > 0 && (
                    <>
                        <label className="flex items-center gap-3 pb-4 cursor-pointer w-fit">
                            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                            <span className="text-sm font-bold text-gray-700">전체 선택 ({selectedIds.size}/{items.length})</span>
                        </label>

                        <div className="divide-y divide-gray-100 border-y border-gray-900">
                            {items.map((item) => (
                                <div key={item.cartItemId} className="py-8 flex gap-6 items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(item.cartItemId)}
                                        onChange={() => toggleSelect(item.cartItemId)}
                                    />
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                        {item.thumbnailUrl && (
                                            <img
                                                src={`/api${item.thumbnailUrl}`}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900">{item.productName}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{item.color} / {item.size}</p>
                                        <p className="text-sm font-black text-gray-900 mt-2">
                                            {item.finalPrice.toLocaleString()} KRW
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1.5">
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="disabled:opacity-30"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                            disabled={item.quantity >= item.availableStock}
                                            className="disabled:opacity-30"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <p className="w-28 text-right text-sm font-black text-gray-900">
                                        {(item.finalPrice * item.quantity).toLocaleString()} KRW
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.cartItemId)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-10">
                            <span className="text-sm font-bold text-gray-500">TOTAL ({selectedItems.length}개 선택)</span>
                            <span className="text-2xl font-black text-gray-900">{totalPrice.toLocaleString()} KRW</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={selectedIds.size === 0}
                            className="w-full h-16 mt-8 bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
