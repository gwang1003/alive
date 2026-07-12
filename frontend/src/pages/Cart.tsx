import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../assets/authStore';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [authChecked, accessToken]);

    const totalPrice = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

    if (!authChecked || !accessToken) {
        return null;
    }

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
                        <div className="divide-y divide-gray-100 border-y border-gray-900">
                            {items.map((item) => (
                                <div key={item.cartItemId} className="py-8 flex gap-6 items-center">
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
                            <span className="text-sm font-bold text-gray-500">TOTAL</span>
                            <span className="text-2xl font-black text-gray-900">{totalPrice.toLocaleString()} KRW</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full h-16 mt-8 bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-black transition-all"
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
