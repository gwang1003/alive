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
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-12">Shopping Cart</h1>

                {isLoading && items.length === 0 && (
                    <p className="text-sm text-ink-soft">불러오는 중...</p>
                )}

                {!isLoading && items.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-ink-soft mb-6">장바구니가 비어있습니다.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-coral text-white text-xs font-black tracking-widest uppercase rounded-full hover:bg-coral-deep transition-all"
                        >
                            쇼핑 계속하기
                        </button>
                    </div>
                )}

                {items.length > 0 && (
                    <>
                        <div className="divide-y divide-line border-y border-ink">
                            {items.map((item) => (
                                <div key={item.cartItemId} className="py-8 flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-canvas rounded-2xl overflow-hidden shrink-0">
                                        {item.thumbnailUrl && (
                                            <img
                                                src={`/api${item.thumbnailUrl}`}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-ink">{item.productName}</h3>
                                        <p className="text-xs text-ink-soft mt-1">{item.color} / {item.size}</p>
                                        <p className="text-sm font-black text-ink mt-2">
                                            {item.finalPrice.toLocaleString()} KRW
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 border border-line rounded-full px-3 py-1.5">
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

                                    <p className="w-28 text-right text-sm font-black text-ink">
                                        {(item.finalPrice * item.quantity).toLocaleString()} KRW
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.cartItemId)}
                                        className="text-ink-soft/50 hover:text-coral-deep transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-10">
                            <span className="text-sm font-bold text-ink-soft">TOTAL</span>
                            <span className="text-2xl font-black text-ink">{totalPrice.toLocaleString()} KRW</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full h-16 mt-8 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-coral-deep transition-all"
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
