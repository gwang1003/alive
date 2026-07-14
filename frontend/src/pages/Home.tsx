import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CrayonUnderline from '../components/CrayonUnderline';
import axios from "../api/axios.ts";
import { getRecentlyViewedIds } from '../utils/recentlyViewed';
import useBannerStore from '../store/bannerStore';

const Home: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [bestProducts, setBestProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const banners = useBannerStore((state) => state.banners);
    const fetchBanners = useBannerStore((state) => state.fetchBanners);
    const heroBanner = banners[0];

    useEffect(() => {
        const init = async () => {
            try {
                const response = await axios.get('/products');
                setProducts(response.data.content);
            } catch (error) {
                console.error('신상품 조회 실패:', error);
            }
            try {
                const bestResponse = await axios.get('/products/popular', { params: { limit: 6 } });
                setBestProducts(bestResponse.data);
            } catch (error) {
                console.error('인기상품 조회 실패:', error);
            }
            try {
                await fetchBanners();
            } catch (error) {
                console.error('배너 조회 실패:', error);
            }
            try {
                const recentIds = getRecentlyViewedIds();
                const detailResponses = await Promise.all(
                    recentIds.map((id) => axios.get(`/products/${id}`).catch(() => null))
                );
                const recent = detailResponses
                    .filter((res) => res !== null)
                    .map((res) => ({ ...res.data, images: res.data.images.map((img) => img.imageUrl) }));
                setRecentProducts(recent);
            } catch (error) {
                console.error('최근 본 상품 조회 실패:', error);
            }
        }
        init()

    }, []);
    return (
        <div className="bg-canvas">
            {/* 1. Hero Section: 꽉 찬 이미지와 여백의 조화 */}
            <section className="relative w-full min-h-[46vh] flex items-center overflow-hidden px-12 py-16 bg-[radial-gradient(560px_280px_at_88%_-10%,rgba(127,196,214,0.30),transparent_70%),radial-gradient(420px_240px_at_6%_110%,rgba(255,200,87,0.26),transparent_70%)]">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-2 items-center">
                    <div className="flex flex-col gap-6">
                        <span className="inline-flex items-center gap-2 w-fit text-[11px] font-bold tracking-widest uppercase text-sage bg-sage/15 rounded-full px-4 py-2">
                            2026 Spring Collection
                        </span>
                        <h1 className="font-display text-5xl font-semibold text-ink leading-[1.1] tracking-tight">
                            {heroBanner ? heroBanner.title : (
                                <>Essential <br /> Spring{' '}
                                    <span className="relative inline-block text-coral-deep">
                                        Layers<CrayonUnderline className="text-coral" />
                                    </span>.
                                </>
                            )}
                        </h1>
                        {!heroBanner && (
                            <p className="text-ink-soft text-lg leading-relaxed max-w-md">
                                우리아이의 활동성을 고려한 프리미엄 소재와 <br />
                                감각적인 디자인의 스프링 컬렉션을 만나보세요.
                            </p>
                        )}
                        <Link
                            to={heroBanner?.linkUrl || '/new'}
                            className="group inline-flex items-center gap-2 w-fit mt-4 bg-coral text-white text-sm font-bold tracking-wide rounded-full px-7 py-3.5 shadow-[0_10px_24px_-10px_rgba(255,107,77,0.7)] hover:-translate-y-0.5 transition-all"
                        >
                            컬렉션 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="relative h-[70vh]">
                        <img
                            src={heroBanner ? `/api${heroBanner.imageUrl}` : "https://images.unsplash.com/photo-1519234129112-25039f60447a?auto=format&fit=crop&q=80&w=800"}
                            className="absolute inset-0 w-full h-full object-cover rounded-bl-[100px]"
                            alt={heroBanner ? heroBanner.title : "spring collection"}
                        />
                    </div>
                </div>
            </section>

            {/* 2. Curation Section: 상품 그리드 */}
            <div className="px-12 py-20">
                <div className="max-w-7xl mx-auto">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-coral-deep mb-3">Just Landed</p>
                    <h2 className="font-display text-2xl font-semibold mb-12 tracking-tight text-ink">New Arrivals.</h2>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Curation Section: 인기 상품 (부드러운 톤 배경으로 리듬감) */}
            <div className="bg-sky/10">
                <div className="px-12 py-20">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-coral-deep mb-3">Loved by Parents</p>
                        <h2 className="font-display text-2xl font-semibold mb-12 tracking-tight text-ink">Best Arrivals.</h2>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                            {bestProducts.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {recentProducts.length > 0 && (
                <div className="px-12 py-20">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-coral-deep mb-3">Take Another Look</p>
                        <h2 className="font-display text-2xl font-semibold mb-12 tracking-tight text-ink">Recently Viewed.</h2>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                            {recentProducts.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;