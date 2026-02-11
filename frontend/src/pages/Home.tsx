import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import pa1 from '../assets/products/a/51ad82f32a54e70a63f79b6fdc706372.jpg';
import pa2 from '../assets/products/a/fb1a71eeb66d56b29fdbd1f52c9740fb.jpg';
import pa3 from '../assets/products/a/45404d8e6a3998d810cd2de1bd68e8c4.jpg';
import pb1 from '../assets/products/b/0c0c4099e186636d9593556db5b24251.jpg';
import pb2 from '../assets/products/b/40faffa8776330d2dd3737b43f78f95b.jpg';
import pb3 from '../assets/products/b/0fcad6c401dcf2b04cf50dc71e8e349a.jpg';
import pb4 from '../assets/products/b/ea082c2b937819a1c6ff9e6988304be1.jpg';
import pc1 from '../assets/products/c/30533322bfcee07e7cfd46c9643703fc.jpg';
import pc2 from '../assets/products/c/d4ea9cbb93119119131daf80e8eb5a78.jpg';
import pc3 from '../assets/products/c/accbfbe0b0f6ad149dee096219f7c34e.jpg';
import pd1 from '../assets/products/d/5d49e962dca012f8f4022001a7ba493c.jpg';
import pd2 from '../assets/products/d/67eb823e8c5c7409be21a52e9c453eef.jpg';
import pd3 from '../assets/products/d/7f7b7dee1484d6e38887b7cad602145c.jpg';
import pe1 from '../assets/products/e/14b56a6c41b841ee38d92b6d05ec4bc1.jpg';
import pe2 from '../assets/products/e/fe8ed413b1c7722042106c34472c4ad2.jpg';
import pe3 from '../assets/products/e/14bc1f53815634312a63fe3c8428d3ad.jpg';
import pf1 from '../assets/products/f/8c947dcdb44de07d36c0c6da689591f5.jpg';
import pf2 from '../assets/products/f/fa6076b75d4a90126471c3edc5353c66.jpg';
import pf3 from '../assets/products/f/43051c1d6f70afd76a24cd53a08d55f2.jpg';

const NEW_PRODUCTS = [
    {
        id: 1,
        name: "프리미엄 코튼 셋업",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pa1,
            pa2,
            pa3
        ],
        tag: ["NEW"]
    },
    {
        id: 2,
        name: "프리미엄 코튼 셋업2",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pb1,
            pb2,
            pb3,
            pb4,
        ],
        tag: ["NEW"]
    },
    {
        id: 3,
        name: "프리미엄 코튼 셋업3",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pc1,
            pc2,
            pc3
        ],
        tag: ["NEW"]
    },
    {
        id: 4,
        name: "프리미엄 코튼 셋업4",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pd1,
            pd2,
            pd3
        ],
        tag: ["NEW"]
    },
    {
        id: 5,
        name: "프리미엄 코튼 셋업5",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pe1,
            pe2,
            pe3
        ],
        tag: ["NEW"]
    },
    {
        id: 6,
        name: "프리미엄 코튼 셋업6",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pf1,
            pf2,
            pf3
        ],
        tag: ["NEW"]
    },
    // ... 나머지 상품들
];

const BEST_PRODUCTS = [
    {
        id: 1,
        name: "프리미엄 코튼 셋업",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pa1,
            pa2,
            pa3
        ],
        tag: ["Best", "Sale"]
    },
    {
        id: 2,
        name: "프리미엄 코튼 셋업2",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pb1,
            pb2,
            pb3,
            pb4,
        ],
        tag: ["Best", "Sale"]
    },
    {
        id: 3,
        name: "프리미엄 코튼 셋업3",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pc1,
            pc2,
            pc3
        ],
        tag: ["Best", "Sale"]
    },
    {
        id: 4,
        name: "프리미엄 코튼 셋업4",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pd1,
            pd2,
            pd3
        ],
        tag: ["Best", "Sale"]
    },
    {
        id: 5,
        name: "프리미엄 코튼 셋업5",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pe1,
            pe2,
            pe3
        ],
        tag: ["Best", "Sale"]
    },
    {
        id: 6,
        name: "프리미엄 코튼 셋업6",
        price: 58000,
        discountRate: 10,
        // 여러 장의 사진을 배열로 넣어줍니다.
        images: [
            pf1,
            pf2,
            pf3
        ],
        tag: ["Best", "Sale"]
    },
    // ... 나머지 상품들
];

const Home: React.FC = () => {
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
                    {NEW_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* 2. Curation Section: 상품 그리드 (보더 최소화) */}
            <div className="mx-auto px-12 py-20">
                <h2 className="text-2xl font-black mb-12 tracking-tight">Best Arrivals.</h2>
                <div className="grid grid-cols-4 gap-x-8 gap-y-16">
                    {BEST_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;