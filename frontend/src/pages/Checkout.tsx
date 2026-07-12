import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../assets/authStore';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, fetchCart } = useCartStore();
    const { createOrder } = useOrderStore();

    const [form, setForm] = useState({ recipientName: '', recipientPhone: '', deliveryAddress: '', deliveryMessage: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [authChecked, accessToken]);

    const totalPrice = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    const deliveryFee = totalPrice >= 50000 ? 0 : 3000;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const order = await createOrder(form);
            await fetchCart();
            navigate(`/orders/${order.orderId}`);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '주문 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!authChecked || !accessToken) {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                <p className="text-gray-400">장바구니가 비어있습니다.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-gray-900 text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-black transition-all"
                >
                    쇼핑 계속하기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black tracking-tighter mb-12">Checkout</h1>

                <div className="grid grid-cols-2 gap-16">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-2">배송 정보</h2>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="recipientName"
                                placeholder="받는 분 성함"
                                value={form.recipientName}
                                onChange={handleChange}
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="recipientPhone"
                                placeholder="연락처 (예: 010-1234-5678)"
                                value={form.recipientPhone}
                                onChange={handleChange}
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="deliveryAddress"
                                placeholder="배송지 주소"
                                value={form.deliveryAddress}
                                onChange={handleChange}
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <textarea
                                name="deliveryMessage"
                                placeholder="배송 요청사항 (선택)"
                                value={form.deliveryMessage}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-gray-100 transition-all min-h-[100px] resize-none"
                            />
                        </div>

                        {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-16 bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-black transition-all disabled:opacity-50"
                        >
                            {submitting ? '주문 처리 중...' : '주문하기'}
                        </button>
                    </form>

                    <div>
                        <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-6">주문 상품</h2>
                        <div className="space-y-4 divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-center pt-4 first:pt-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                                        <p className="text-xs text-gray-400">{item.color} / {item.size} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-900">
                                        {(item.finalPrice * item.quantity).toLocaleString()} KRW
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-900 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>상품 금액</span>
                                <span>{totalPrice.toLocaleString()} KRW</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>배송비</span>
                                <span>{deliveryFee.toLocaleString()} KRW</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                                <span>총 결제 금액</span>
                                <span>{(totalPrice + deliveryFee).toLocaleString()} KRW</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
