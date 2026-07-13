import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../assets/authStore';

const resolveImageSrc = (img: string | null) => {
    if (!img) return '';
    return img.startsWith('/products/') ? `/api${img}` : img;
};

const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { items, isLoading, fetchWishlist, removeWishlist } = useWishlistStore();

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
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black tracking-tighter mb-12">위시리스트</h1>

                {isLoading && items.length === 0 && <p className="text-sm text-gray-400">불러오는 중...</p>}

                {!isLoading && items.length === 0 && (
                    <p className="text-gray-400 text-center py-32">위시리스트가 비어있습니다.</p>
                )}

                <div className="grid grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item.wishlistId} className="group relative">
                            <button
                                onClick={() => removeWishlist(item.productId)}
                                className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white"
                            >
                                <X className="w-4 h-4 text-gray-700" />
                            </button>
                            <div
                                onClick={() => navigate(`/product/detail/${item.productId}`)}
                                className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm cursor-pointer"
                            >
                                <img
                                    src={resolveImageSrc(item.thumbnailUrl)}
                                    alt={item.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">{item.productName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-black text-gray-900">
                                        {item.finalPrice.toLocaleString()} KRW
                                    </span>
                                    {!!item.discountRate && item.discountRate > 0 && (
                                        <span className="text-[13px] text-red-500 font-bold">{item.discountRate}%</span>
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
