import React, {useRef, useState} from 'react';
import {Heart, Share2, ShoppingBag, ShoppingCart} from 'lucide-react';
import pa1 from '../assets/products/a/51ad82f32a54e70a63f79b6fdc706372.jpg';
import pa2 from '../assets/products/a/fb1a71eeb66d56b29fdbd1f52c9740fb.jpg';
import pa3 from '../assets/products/a/45404d8e6a3998d810cd2de1bd68e8c4.jpg';

const ProductDetail: React.FC = () => {
    // 스크롤 이동을 위한 레퍼런스 생성 (Java의 참조 변수와 비슷합니다)
    const detailRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);
    const guideRef = useRef<HTMLDivElement>(null);
    const qnaRef = useRef<HTMLDivElement>(null);
    const realatedRef = useRef<HTMLDivElement>(null);

    const [mainImage, setMainImage] = useState(pa1);

    // 썸네일 이미지 리스트
    const thumbnails = [
        pa1,
        pa2,
        pa3,
        pa2,
        pa3
    ];

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const quickMenus = [
        { name: '상세정보', ref: detailRef },
        { name: '구매후기 (73)', ref: reviewRef },
        { name: '가이드', ref: guideRef },
        { name: '상품문의', ref: qnaRef },
        { name: '추천상품', ref: realatedRef },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* 이미지 영역 강조 레이아웃 (7:3 비율에 가깝게 조정) */}
            <section className="max-w-[1440px] mx-auto px-12 py-16 grid grid-cols-[1.3fr_0.7fr] gap-16">

                {/* [왼쪽] 대형 이미지 영역 */}
                <div className="flex gap-6">
                    {/* 서브 이미지: 5개가 메인 높이와 일치하도록 높이값 계산 */}
                    <div className="flex flex-col justify-between w-[120px] shrink-0">
                        {thumbnails.map((img, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setMainImage(img)} // 클릭 대신 마우스만 올려도 바뀌게 하면 더 힙함
                                className={`aspect-square w-full rounded-lg overflow-hidden cursor-pointer transition-all border-2
                  ${mainImage === img ? 'border-gray-900 opacity-100' : 'border-transparent opacity-60'}`}
                            >
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* 메인 썸네일: 5:5 비율(aspect-square)로 큼직하게 배치 */}
                    <div className="flex-1 aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-50 shadow-sm">
                        <img
                            src={mainImage}
                            alt="main"
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    </div>
                </div>

                {/* [오른쪽] 정보 구매 영역 */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">Alive Kids</p>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">미니 피그 후드티</h1>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 rounded-full hover:bg-gray-100 transition-colors"><Share2 className="w-5 h-5 text-gray-600" /></button>
                            <button className="p-3 rounded-full hover:bg-gray-100 transition-colors"><Heart className="w-5 h-5 text-gray-600" /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                        <span className="text-3xl font-[900] text-gray-900">29,900원</span>
                        <span className="text-xl font-bold text-red-500">5%</span>
                        <span className="text-sm text-gray-300 line-through">31,400원</span>
                    </div>

                    {/* 깔끔한 옵션 선택 */}
                    <div className="space-y-6 mb-12">
                        <div className="group">
                            <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-widest group-focus-within:text-gray-900 transition-colors uppercase">Color</label>
                            <select className="w-full border-b-2 border-gray-100 py-3 text-sm font-bold outline-none focus:border-gray-900 transition-all bg-transparent cursor-pointer">
                                <option>색상을 선택해주세요</option>
                                <option>멜란지 그레이</option>
                                <option>네이비</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-widest group-focus-within:text-gray-900 transition-colors uppercase">Size</label>
                            <select className="w-full border-b-2 border-gray-100 py-3 text-sm font-bold outline-none focus:border-gray-900 transition-all bg-transparent cursor-pointer">
                                <option>사이즈를 선택해주세요</option>
                                <option>100 (3-4세)</option>
                                <option>110 (4-5세)</option>
                            </select>
                        </div>
                    </div>

                    {/* 버튼 세트 */}
                    <div className="grid grid-cols-2 gap-4 h-16">
                        <button className="bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-black transition-all flex items-center justify-center gap-2">
                            Buy Now
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-900 font-black text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* 스티키 메뉴 (상단 고정) */}
            <nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-12 flex justify-center">
                    {quickMenus.map((menu) => (
                        <button
                            key={menu.name}
                            onClick={() => menu.name === '상세정보' ? scrollToSection(detailRef) : null}
                            className="px-12 py-6 text-[12px] font-black text-gray-400 hover:text-gray-900 tracking-[0.15em] relative group"
                        >
                            {menu.name}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gray-900 transition-all group-hover:w-full" />
                        </button>
                    ))}
                </div>
            </nav>

            {/* 컨텐츠 영역 */}
            <div className="max-w-7xl mx-auto py-20 min-h-[1500px]" ref={detailRef}>
                <div className="w-full aspect-[4/5] bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-50">
                    <p className="text-gray-300 font-bold tracking-widest">상세 설명 이미지 영역</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;