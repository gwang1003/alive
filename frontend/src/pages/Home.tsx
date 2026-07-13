import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from "../api/axios.ts";
import { getRecentlyViewedIds } from '../utils/recentlyViewed';

const Home: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [bestProducts, setBestProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
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
        <div className="bg-white">
            {/* 1. Hero Section: 꽉 찬 이미지와 여백의 조화 */}
            <section className="relative w-full h-[40vh] bg-[#f2f2f2] flex items-center overflow-hidden">
                <div className="max-w-7xl mx-auto px-12 w-full grid grid-cols-2 items-center">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Essential <br />
                            Spring Layers.
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                            우리아이의 활동성을 고려한 프리미엄 소재와 <br />
                            감각적인 디자인의 스프링 컬렉션을 만나보세요.
                        </p>
                        <Link to="/new" className="flex items-center gap-2 group text-sm font-bold tracking-widest mt-4">
                            COLLECTION VIEW <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                    <div className="relative h-[80vh]">
                        <img
                            src="https://images.unsplash.com/photo-1519234129112-25039f60447a?auto=format&fit=crop&q=80&w=800"
                            className="absolute inset-0 w-full h-full object-cover rounded-bl-[100px]"
                            alt="spring collection"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Curation Section: 상품 그리드 (보더 최소화) */}
            <div className="mx-auto px-12 py-20">
                <h2 className="text-2xl font-black mb-12 tracking-tight">New Arrivals.</h2>
                <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>

            {/* 2. Curation Section: 상품 그리드 (보더 최소화) */}
            <div className="mx-auto px-12 py-20">
                <h2 className="text-2xl font-black mb-12 tracking-tight">Best Arrivals.</h2>
                <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                    {bestProducts.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>

            {recentProducts.length > 0 && (
                <div className="mx-auto px-12 py-20">
                    <h2 className="text-2xl font-black mb-12 tracking-tight">Recently Viewed.</h2>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                        {recentProducts.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;