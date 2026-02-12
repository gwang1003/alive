import React, {useRef, useState} from 'react';
import {Heart, Share2, ShoppingBag, ShoppingCart} from 'lucide-react';
import pa1 from '../assets/products/a/51ad82f32a54e70a63f79b6fdc706372.jpg';
import pa2 from '../assets/products/a/fb1a71eeb66d56b29fdbd1f52c9740fb.jpg';
import pa3 from '../assets/products/a/45404d8e6a3998d810cd2de1bd68e8c4.jpg';
import pb1 from '../assets/products/b/0c0c4099e186636d9593556db5b24251.jpg';
import pb2 from '../assets/products/b/40faffa8776330d2dd3737b43f78f95b.jpg';
import bottomSize from '../assets/products/common/bottomSize.jpg';
import topSize from '../assets/products/common/topSize.jpg';

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
        pb1,
        pb2
    ];

    const data = {
        "productId": 101,
        "modelInfo": {
            "name": "민수",
            "height": "110cm",
            "weight": "19kg",
            "wearingSize": "110",
            "wearingColor": "Melange Grey"
        },
        "sections": {
            "mainImage": pa1,
            "multiAngles": [
                pa2,
                pa3,
                pb1,
                pb2
            ],
            "description": "활동량이 많은 아이들을 위해 탄탄한 분또 소재로 제작된 후드티입니다. 루즈한 핏으로 편안한 착용감을 선사하며, 세탁 후 변형이 적어 데일리 아이템으로 추천합니다.",
            "detailViews": [
                pa2,
                pa3,
                pb1,
            ]
        }
    }

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const quickMenus = [
        { name: '상세정보', ref: detailRef },
        { name: '가이드', ref: guideRef },
        { name: '구매후기 (73)', ref: reviewRef },
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
            <nav className="sticky top-12 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-12 flex justify-center">
                    {quickMenus.map((menu) => (
                        <button
                            key={menu.name}
                            onClick={() => scrollToSection(menu.ref)}
                            className="px-12 py-6 text-[12px] font-black text-gray-400 hover:text-gray-900 tracking-[0.15em] relative group"
                        >
                            {menu.name}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gray-900 transition-all group-hover:w-full" />
                        </button>
                    ))}
                </div>
            </nav>

            {/*/!* 상세 정보 영역 *!/*/}
            {/*<div className="max-w-4xl mx-auto py-24" ref={detailRef}>*/}
            {/*    <div className="flex flex-col gap-20 items-center">*/}
            {/*        <div className="text-center space-y-4">*/}
            {/*            <h3 className="text-2xl font-black tracking-tighter">PREMIUM COTTON 100%</h3>*/}
            {/*            <p className="text-gray-500 leading-relaxed">*/}
            {/*                아이들의 예민한 피부를 위해 선별된 프리미엄 코튼 소재로 제작되었습니다.<br/>*/}
            {/*                수차례의 워싱 과정을 거쳐 세탁 후에도 변형이 적고 부드러운 터치감을 유지합니다.*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*        /!* 여기에 상세페이지 통이미지들 배치 *!/*/}
            {/*        <div className="w-full space-y-4">*/}
            {/*            <img src={pa1} alt="detail-1" className="w-full rounded-2xl" />*/}
            {/*            <img src={pa2} alt="detail-2" className="w-full rounded-2xl" />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 상세정보 컨텐츠 영역 */}
            <div className="max-w-4xl mx-auto py-20 flex flex-col gap-32" ref={detailRef}>

                {/* 1. 모델 착용 컷: 메인 이미지 */}
                <section className="space-y-6">
                    <div className="w-full rounded-2xl overflow-hidden bg-gray-50">
                        <img src={data.sections.mainImage} alt="Main Wear" className="w-full object-cover" />
                    </div>

                    {/* 전후좌우 4컷 그리드 */}
                    <div className="grid grid-cols-4 gap-4">
                        {data.sections.multiAngles && data.sections.multiAngles.map((img:string) =>
                            <img src={img} alt="Front" className="w-full rounded-xl bg-gray-50" />
                        )}
                    </div>
                </section>

                {/* 2. 모델 정보 스펙 보드: 세련된 박스 디자인 */}
                <section className="bg-gray-50 rounded-2xl p-10 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Model Info</span>
                        <h4 className="text-xl font-black text-gray-900">MODEL ${data.modelInfo.name}</h4>
                    </div>
                    <div className="flex gap-12">
                        {[
                            { label: 'HEIGHT', value: `${data.modelInfo.height}` },
                            { label: 'WEIGHT', value: `${data.modelInfo.weight}` },
                            { label: 'SIZE', value: `${data.modelInfo.wearingSize}` },
                            { label: 'COLOR', value: `${data.modelInfo.wearingColor}` },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-400">{item.label}</span>
                                <span className="text-sm font-black text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. 상품 설명: 타이포그래피 강조 */}
                <section className="py-10 text-center space-y-8">
                    <div className="inline-block border-b-2 border-gray-900 pb-2">
                        <h3 className="text-2xl font-black tracking-tight italic">Product Comment</h3>
                    </div>
                    <p className="text-lg text-gray-600 leading-[1.8] max-w-2xl mx-auto font-medium">
                        {data.sections.description}
                    </p>
                </section>

                {/* 4. 디테일 뷰: 옷의 디테일 컷 (통이미지 느낌으로 쭉 나열) */}
                <section className="space-y-12">
                    <div className="flex flex-col items-center gap-4 mb-16">
                        <span className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">Detail View</span>
                        <h3 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Focus on Detail.</h3>
                    </div>

                    {/* 디테일 이미지들을 반복문 없이 수동으로 배치 (하드코딩) */}
                    <div className="flex flex-col gap-6">
                        {data.sections.detailViews && data.sections.detailViews.map((img:string) =>
                            <img src={img} alt="Detail 1" className="w-full rounded-2xl" />
                        )}
                        {/*<img src={data.sections.detailViews[0]} alt="Detail 1" className="w-full rounded-2xl" />*/}
                        {/*<img src={data.sections.detailViews[1]} alt="Detail 2" className="w-full rounded-2xl" />*/}
                        {/*<img src={data.sections.detailViews[2]} alt="Detail 3" className="w-full rounded-2xl" />*/}
                        {/*<img src={data.sections.detailViews[0]} alt="Detail 4" className="w-full rounded-2xl" />*/}
                    </div>
                </section>
            </div>
            {/* 가이드 영역 */}
            <div className="max-w-7xl mx-auto py-32 border-t border-gray-50" ref={guideRef}>
                <h3 className="text-3xl font-black mb-16 tracking-tight uppercase">Shopping Guide.</h3>

                <div className="flex flex-col gap-32">
                    {/* 사이즈 가이드 섹션 */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 border-l-4 border-gray-900 pl-4 tracking-widest uppercase">Size Guide</h4>

                        {/* 상의 사이즈 가이드 */}
                        <div className="grid grid-cols-[0.5fr_1.5fr] gap-20 items-center">
                            <div className="rounded-2xl p-8">
                                <img src={topSize} />
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6 text-left">Size (상의)</th>
                                    <th className="py-4 px-6">어깨너비</th>
                                    <th className="py-4 px-6">가슴단면</th>
                                    <th className="py-4 px-6">소매길이</th>
                                    <th className="py-4 px-6">총길이</th>
                                </tr>
                                </thead>
                                <tbody className="text-center divide-y divide-gray-100">
                                {['100', '110', '120'].map(size => (
                                    <tr key={size} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-5 px-6 text-left font-black text-gray-900">{size}</td>
                                        <td>38</td><td>40</td><td>36</td><td>42</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 하의 사이즈 가이드 */}
                        <div className="grid grid-cols-[0.5fr_1.5fr] gap-20 items-center">
                            <div className="rounded-2xl p-8">
                                <img src={bottomSize} alt="Bottom Size Guide" />
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6 text-left">Size (하의)</th>
                                    <th className="py-4 px-6">허리단면</th>
                                    <th className="py-4 px-6">힙단면</th>
                                    <th className="py-4 px-6">허벅지단면</th>
                                    <th className="py-4 px-6">총길이</th>
                                </tr>
                                </thead>
                                <tbody className="text-center divide-y divide-gray-100">
                                {['100', '110', '120'].map(size => (
                                    <tr key={size} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-5 px-6 text-left font-black text-gray-900">{size}</td>
                                        <td>24</td><td>34</td><td>18</td><td>55</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 배송/교환 가이드 섹션 */}
                    <div className="grid grid-cols-2 gap-16 pt-16 border-t border-gray-50">
                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900 text-sm tracking-widest uppercase">Delivery Info</h4>
                            <div className="bg-gray-50 p-8 rounded-2xl text-sm text-gray-600 leading-relaxed space-y-2">
                                <p>• 기본배송료는 3,000원이며 50,000원 이상 구매 시 무료배송입니다.</p>
                                <p>• 제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
                                <p>• 배송은 결제 확인 후 2-5일(영업일 기준) 정도 소요됩니다.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900 text-sm tracking-widest uppercase">Return & Exchange</h4>
                            <div className="bg-gray-50 p-8 rounded-2xl text-sm text-gray-600 leading-relaxed space-y-2">
                                <p>• 교환/반품은 상품 수령 후 7일 이내에 신청 가능합니다.</p>
                                <p>• 단순 변심으로 인한 교환/반품 시 왕복 배송비는 고객 부담입니다.</p>
                                <p>• 상품의 텍(Tag) 제거 또는 착용 흔적이 있을 경우 교환/반품이 불가합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 구매후기 영역 */}
            <div className="max-w-7xl mx-auto py-32 border-t border-gray-50" ref={reviewRef}>
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-end gap-4">
                        <h3 className="text-3xl font-black tracking-tight uppercase">User Reviews</h3>
                        <span className="text-xl font-bold text-red-500">73건</span>
                    </div>
                </div>

                {/* [신규] 리뷰 통계 대시보드 영역 */}
                <div className="bg-gray-50 rounded-3xl p-12 grid grid-cols-[1fr_2fr] gap-20 mb-20 items-center">
                    {/* 왼쪽: 평균 별점 */}
                    <div className="flex flex-col items-center justify-center border-r border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-6xl font-black text-gray-900 leading-none">4.6</span>
                            <div className="flex flex-col">
                                <div className="flex text-blue-600 text-2xl">★★★★★</div>
                                <p className="text-sm font-bold text-gray-400 mt-1">리뷰 1,312개</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-gray-700">79%의 구매자가 <span className="text-blue-600">아주 좋아요</span> 라고 평가했습니다.</p>
                        <button className="mt-8 w-full max-w-[200px] h-14 bg-gray-900 text-white font-black text-xs tracking-widest uppercase rounded-xl hover:bg-black transition-all">
                            내 리뷰 작성하기
                        </button>
                    </div>

                    {/* 오른쪽: 점수별 그래프 */}
                    <div className="flex flex-col gap-3">
                        {[
                            { label: '아주 좋아요', count: 1037, color: 'bg-blue-600' },
                            { label: '맘에 들어요', count: 33, color: 'bg-gray-300' },
                            { label: '보통이에요', count: 241, color: 'bg-gray-400' },
                            { label: '그냥 그래요', count: 1, color: 'bg-gray-200' },
                            { label: '별로예요', count: 0, color: 'bg-gray-100' },
                        ].map((stat) => (
                            <div key={stat.label} className="grid grid-cols-[80px_1fr_60px] items-center gap-6">
                                <span className="text-xs font-bold text-gray-500">{stat.label}</span>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${stat.color} transition-all duration-1000`}
                                        style={{ width: `${(stat.count / 1312) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-black text-gray-900 text-right">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 리뷰 필터 및 리스트 영역 (기존 코드 유지) */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-6">
                        {['최신순', 'AI 추천순', '별점순'].map(tab => (
                            <button key={tab} className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                                {tab === 'AI 추천순' ? `✨ ${tab}` : tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="리뷰 키워드 검색"
                            className="pl-4 pr-10 py-3 bg-gray-50 rounded-xl text-xs font-bold outline-none w-64 border border-transparent focus:border-gray-200"
                        />
                    </div>
                </div>

                {/* 베스트 포토 리뷰 그리드 */}
                <div className="grid grid-cols-5 gap-4 mb-20">
                    {[pa1, pa2, pa3, pb1, pb2].map((img, i) => (
                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-100">
                            <img src={img} alt="photo review" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {i === 4 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">+12</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 텍스트 리뷰 리스트 */}
                <div className="border-t border-gray-900">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="py-10 border-b border-gray-100 grid grid-cols-[1fr_3fr_1fr] gap-10">
                            <div className="flex flex-col gap-2">
                                <div className="flex text-yellow-400 text-xs">★★★★★</div>
                                <span className="text-sm font-black text-gray-900">kim****</span>
                                <span className="text-xs text-gray-400">2024.02.11 | 110 구매</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-800 leading-relaxed">
                                    우리 아이 키가 105cm인데 110 사이즈 딱 예쁘게 맞아요! 소재가 너무 톡톡하고 세탁기 돌려도 변형이 없어서 너무 만족합니다. 역시 믿고 사는 Alive Kids네요.
                                </p>
                                <div className="flex gap-2">
                                    <img src={pa1} className="w-16 h-16 rounded-lg object-cover" alt="review small" />
                                </div>
                            </div>
                            <div className="flex justify-end items-start">
                                <button className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded hover:bg-gray-50 transition-colors">도움돼요 0</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 페이징 버튼 예시 */}
                <div className="flex justify-center mt-16 gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === 1 ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* 상품문의 섹션 */}
            <div className="max-w-7xl mx-auto py-24 border-t border-gray-50" ref={qnaRef}>
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-black tracking-tight">Product Q&A</h3>
                    <button className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded-full">문의하기</button>
                </div>
                <div className="border-t border-gray-900">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between py-6 border-b border-gray-100 text-sm">
                            <div className="flex gap-6 items-center">
                                <span className="text-gray-400 font-bold">답변완료</span>
                                <span className="font-medium text-gray-800">재입고 언제 되나요?</span>
                            </div>
                            <div className="text-gray-400">lee**** | 2024.02.10</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 추천상품 섹션 */}
            <div className="max-w-7xl mx-auto py-24 border-t border-gray-50 mb-40" ref={realatedRef}>
                <h3 className="text-2xl font-black mb-12 tracking-tight">Related Items.</h3>
                <div className="grid grid-cols-5 gap-6">
                    {[pb1, pb2, pa1, pa2, pa3].map((img, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-50">
                                <img src={img} alt="related" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">코튼 베이직 팬츠</h4>
                            <p className="text-sm font-black text-gray-900 mt-1">24,000원</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;