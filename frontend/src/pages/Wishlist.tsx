import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../assets/authStore';

const resolveImageSrc = (img: string | null) => {
    if (!img) return '';
    return img.startsWith('/products/') ? `/api${img}` : img;
};

// 위시리스트 페이지 — 찜한 상품 그리드 표시, 상품 클릭 시 상세로 이동, X 클릭 시 찜 해제
const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, isLoading, fetchWishlist, removeWishlist } = useWishlistStore();

    // 로그인 확인 후 위시리스트 조회, 미로그인 시 로그인 페이지로 이동
    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-12">위시리스트</h1>

                {isLoading && items.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}

                {!isLoading && items.length === 0 && (
                    <p className="text-ink-soft text-center py-32">위시리스트가 비어있습니다.</p>
                )}

                <div className="grid grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item.wishlistId} className="group relative">
                            <button
                                onClick={() => removeWishlist(item.productId)}
                                className="absolute top-3 right-3 z-10 p-2 bg-surface/90 rounded-full shadow-sm hover:bg-surface"
                            >
                                <X className="w-4 h-4 text-ink-soft" />
                            </button>
                            <div
                                onClick={() => navigate(`/product/detail/${item.productId}`)}
                                className="aspect-[3/4] overflow-hidden bg-canvas rounded-2xl cursor-pointer"
                            >
                                <img
                                    src={resolveImageSrc(item.thumbnailUrl)}
                                    alt={item.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <h3 className="text-[14px] font-bold text-ink tracking-tight">{item.productName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-black text-ink">
                                        {item.finalPrice.toLocaleString()} KRW
                                    </span>
                                    {!!item.discountRate && item.discountRate > 0 && (
                                        <span className="text-[13px] text-coral-deep font-bold">{item.discountRate}%</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
