import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../assets/authStore';
import useAddressStore from '../store/addressStore';
import { formatPhoneNumber } from '../utils/phone';
import PostcodeSearchModal from '../components/PostcodeSearchModal';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, fetchCart } = useCartStore();
    const { createOrder } = useOrderStore();
    const { addresses, fetchAddresses } = useAddressStore();

    const [form, setForm] = useState({ recipientName: '', recipientPhone: '', deliveryAddress: '', deliveryMessage: '' });
    const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
    const [newZipcode, setNewZipcode] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newAddressDetail, setNewAddressDetail] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPostcodeSearch, setShowPostcodeSearch] = useState(false);

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchCart();
        fetchAddresses();
    }, [authChecked, accessToken]);

    useEffect(() => {
        const defaultAddress = addresses.find((a) => a.isDefault);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.addressId);
            setForm((prev) => ({
                ...prev,
                recipientName: defaultAddress.recipientName,
                recipientPhone: defaultAddress.phone,
                deliveryAddress: `(${defaultAddress.zipcode}) ${defaultAddress.address} ${defaultAddress.addressDetail ?? ''}`.trim(),
            }));
        }
    }, [addresses]);

    const handleSelectAddress = (id: number | 'new') => {
        setSelectedAddressId(id);
        if (id === 'new') {
            setForm({ recipientName: '', recipientPhone: '', deliveryAddress: '', deliveryMessage: form.deliveryMessage });
            setNewZipcode('');
            setNewAddress('');
            setNewAddressDetail('');
            return;
        }
        const addr = addresses.find((a) => a.addressId === id);
        if (addr) {
            setForm((prev) => ({
                ...prev,
                recipientName: addr.recipientName,
                recipientPhone: addr.phone,
                deliveryAddress: `(${addr.zipcode}) ${addr.address} ${addr.addressDetail ?? ''}`.trim(),
            }));
        }
    };

    const totalPrice = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    const deliveryFee = totalPrice >= 50000 ? 0 : 3000;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'recipientPhone') {
            setForm(prev => ({ ...prev, recipientPhone: formatPhoneNumber(value) }));
            return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePostcodeComplete = ({ zonecode, address }: { zonecode: string; address: string }) => {
        setNewZipcode(zonecode);
        setNewAddress(address);
        setForm((prev) => ({
            ...prev,
            deliveryAddress: `(${zonecode}) ${address} ${newAddressDetail}`.trim(),
        }));
        setShowPostcodeSearch(false);
    };

    const handleAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const detail = e.target.value;
        setNewAddressDetail(detail);
        setForm((prev) => ({
            ...prev,
            deliveryAddress: `(${newZipcode}) ${newAddress} ${detail}`.trim(),
        }));
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
            <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-6">
                <p className="text-ink-soft">장바구니가 비어있습니다.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-coral text-white text-xs font-black tracking-widest uppercase rounded-full hover:bg-coral-deep transition-all"
                >
                    쇼핑 계속하기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-12">Checkout</h1>

                <div className="grid grid-cols-2 gap-16">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xs font-black text-ink-soft tracking-widest uppercase mb-2">배송 정보</h2>

                        {addresses.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {addresses.map((addr) => (
                                    <label key={addr.addressId} className="flex items-start gap-3 p-3 rounded-xl border border-line cursor-pointer text-sm has-[:checked]:border-coral">
                                        <input
                                            type="radio"
                                            name="savedAddress"
                                            checked={selectedAddressId === addr.addressId}
                                            onChange={() => handleSelectAddress(addr.addressId)}
                                            className="mt-1"
                                        />
                                        <span>
                                            <span className="font-bold text-ink">{addr.recipientName}</span>
                                            {addr.isDefault && <span className="ml-2 text-[10px] font-black text-white bg-coral px-2 py-0.5 rounded-full">기본</span>}
                                            <br />
                                            <span className="text-ink-soft text-xs">({addr.zipcode}) {addr.address} {addr.addressDetail}</span>
                                        </span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-line cursor-pointer text-sm has-[:checked]:border-coral">
                                    <input
                                        type="radio"
                                        name="savedAddress"
                                        checked={selectedAddressId === 'new'}
                                        onChange={() => handleSelectAddress('new')}
                                    />
                                    새 배송지 입력
                                </label>
                            </div>
                        )}

                        <div className="space-y-1">
                            <input
                                type="text"
                                name="recipientName"
                                placeholder="받는 분 성함"
                                value={form.recipientName}
                                onChange={handleChange}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
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
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        {selectedAddressId === 'new' ? (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="우편번호"
                                        value={newZipcode}
                                        readOnly
                                        required
                                        className="flex-1 h-14 border-b border-line outline-none transition-colors text-sm font-medium text-ink-soft"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPostcodeSearch(true)}
                                        className="shrink-0 px-4 text-[11px] font-bold text-ink-soft border-b border-line hover:text-coral-deep whitespace-nowrap"
                                    >
                                        우편번호 찾기
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="주소"
                                    value={newAddress}
                                    readOnly
                                    required
                                    className="w-full h-14 border-b border-line outline-none transition-colors text-sm font-medium text-ink-soft"
                                />
                                <input
                                    type="text"
                                    placeholder="상세주소 (동/호수)"
                                    value={newAddressDetail}
                                    onChange={handleAddressDetailChange}
                                    className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="deliveryAddress"
                                    placeholder="배송지 주소"
                                    value={form.deliveryAddress}
                                    readOnly
                                    className="w-full h-14 border-b border-line outline-none transition-colors text-sm font-medium text-ink-soft"
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-1">
                            <textarea
                                name="deliveryMessage"
                                placeholder="배송 요청사항 (선택)"
                                value={form.deliveryMessage}
                                onChange={handleChange}
                                className="w-full bg-surface border border-line rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-coral/20 transition-all min-h-[100px] resize-none"
                            />
                        </div>

                        {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            {submitting ? '주문 처리 중...' : '주문하기'}
                        </button>
                    </form>

                    <div>
                        <h2 className="text-xs font-black text-ink-soft tracking-widest uppercase mb-6">주문 상품</h2>
                        <div className="space-y-4 divide-y divide-line">
                            {items.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-center pt-4 first:pt-0">
                                    <div>
                                        <p className="text-sm font-bold text-ink">{item.productName}</p>
                                        <p className="text-xs text-ink-soft">{item.color} / {item.size} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-ink">
                                        {(item.finalPrice * item.quantity).toLocaleString()} KRW
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-ink space-y-2">
                            <div className="flex justify-between text-sm text-ink-soft">
                                <span>상품 금액</span>
                                <span>{totalPrice.toLocaleString()} KRW</span>
                            </div>
                            <div className="flex justify-between text-sm text-ink-soft">
                                <span>배송비</span>
                                <span>{deliveryFee.toLocaleString()} KRW</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-ink pt-2">
                                <span>총 결제 금액</span>
                                <span>{(totalPrice + deliveryFee).toLocaleString()} KRW</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPostcodeSearch && (
                <PostcodeSearchModal
                    onComplete={handlePostcodeComplete}
                    onClose={() => setShowPostcodeSearch(false)}
                />
            )}
        </div>
    );
};

export default Checkout;
