import React, {useEffect, useRef, useState} from 'react';
import {Heart, ShoppingBag, ShoppingCart, X, ZoomIn} from 'lucide-react';
import bottomSize from '../assets/products/common/bottomSize.jpg';
import topSize from '../assets/products/common/topSize.jpg';
import {useNavigate, useParams} from "react-router-dom";
import axios from "../api/axios.ts";
import useCartStore from "../store/cartStore";
import useAuthStore from "../assets/authStore.tsx";
import useReviewStore from "../store/reviewStore";
import useWishlistStore from "../store/wishlistStore";
import { addRecentlyViewed } from "../utils/recentlyViewed";
import useRestockStore from "../store/restockStore";

const ProductDetail: React.FC = () => {
    // 스크롤 이동을 위한 레퍼런스 생성 (Java의 참조 변수와 비슷합니다)
    const detailRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);
    const guideRef = useRef<HTMLDivElement>(null);
    const realatedRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const addToCart = useCartStore((state) => state.addToCart);

    const reviews = useReviewStore((state) => state.reviews);
    const reviewTotalPages = useReviewStore((state) => state.totalPages);
    const reviewSummary = useReviewStore((state) => state.summary);
    const reviewableItems = useReviewStore((state) => state.reviewableItems);
    const fetchReviews = useReviewStore((state) => state.fetchReviews);
    const fetchReviewSummary = useReviewStore((state) => state.fetchSummary);
    const fetchReviewableItems = useReviewStore((state) => state.fetchReviewableItems);
    const createReview = useReviewStore((state) => state.createReview);
    const uploadReviewImages = useReviewStore((state) => state.uploadReviewImages);

    const wishlistItems = useWishlistStore((state) => state.items);
    const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
    const addWishlist = useWishlistStore((state) => state.addWishlist);
    const removeWishlist = useWishlistStore((state) => state.removeWishlist);

    const [mainImage, setMainImage] = useState("");
    const { productId } = useParams();
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [productData, setProductData] = useState();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [cartQuantity, setCartQuantity] = useState(1);
    const [cartError, setCartError] = useState('');
    const [restockRequested, setRestockRequested] = useState(false);
    const [restockSubmitting, setRestockSubmitting] = useState(false);

    const requestRestockNotification = useRestockStore((state) => state.requestNotification);
    const cancelRestockNotification = useRestockStore((state) => state.cancelNotification);
    const checkRestockRequested = useRestockStore((state) => state.checkRequested);

    const [reviewSort, setReviewSort] = useState<'createdAt' | 'rating'>('createdAt');
    const [reviewPage, setReviewPage] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | ''>('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewSubmitError, setReviewSubmitError] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([]);

    useEffect(() => {
        const init = async() => {
            const response = await axios.get(`/products/${productId}`)
            console.log(response)
            setMainImage(response.data.images[0].imageUrl)
            setThumbnails(response.data.images.filter((img) => img.isThumbnail == false))
            setProductData(response.data)
            setSelectedColor('');
            setSelectedSize('');
            setCartQuantity(1);
            setCartError('');
            console.log(thumbnails)
            addRecentlyViewed(Number(productId));
        }
        init();
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, [productId]);

    useEffect(() => {
        if (!productId) return;
        fetchReviews(Number(productId), reviewPage, `${reviewSort},desc`);
        fetchReviewSummary(Number(productId));
    }, [productId, reviewPage, reviewSort]);

    useEffect(() => {
        if (!productId || !accessToken) return;
        fetchReviewableItems(Number(productId));
    }, [productId, accessToken]);

    useEffect(() => {
        if (!accessToken) return;
        fetchWishlist();
    }, [accessToken]);

    useEffect(() => {
        if (!productData?.categoryId) return;
        const fetchRelated = async () => {
            try {
                const response = await axios.get('/products', { params: { categoryId: productData.categoryId, size: 5 } });
                setRelatedProducts(response.data.content.filter((p) => p.productId !== Number(productId)));
            } catch (error) {
                console.error('추천상품 조회 실패:', error);
            }
        };
        fetchRelated();
    }, [productData?.categoryId, productId]);

    useEffect(() => {
        if (!accessToken || !productData) {
            setRestockRequested(false);
            return;
        }
        const stocks = productData.sizes || [];
        const stock = stocks.find((s) => s.color === selectedColor && s.size === selectedSize);
        if (!stock || stock.quantity > 0) {
            setRestockRequested(false);
            return;
        }
        checkRestockRequested(stock.stockId).then(setRestockRequested).catch(() => {});
    }, [selectedColor, selectedSize, accessToken, productData]);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const quickMenus = [
        { name: '상세정보', ref: detailRef },
        { name: '가이드', ref: guideRef },
        { name: `구매후기 (${reviewSummary?.totalCount ?? 0})`, ref: reviewRef },
        { name: '추천상품', ref: realatedRef },
    ];
    if(productData == null) {
        return (<div></div>)
    }

    const stocks = productData.sizes || [];
    const availableColors = [...new Set(stocks.map((s) => s.color))];
    const availableSizes = [...new Set(stocks.map((s) => s.size))];
    const selectedStock = stocks.find((s) => s.color === selectedColor && s.size === selectedSize);

    const handleAddToCart = async () => {
        setCartError('');

        if (!selectedStock) {
            setCartError('색상과 사이즈를 선택해주세요');
            return;
        }
        if (!accessToken) {
            navigate('/login');
            return;
        }

        try {
            await addToCart(selectedStock.stockId, cartQuantity);
            alert('장바구니에 담았습니다');
        } catch (error: any) {
            setCartError(error.response?.data?.message ?? '장바구니 담기에 실패했습니다');
        }
    };

    const handleBuyNow = () => {
        setCartError('');

        if (!selectedStock) {
            setCartError('색상과 사이즈를 선택해주세요');
            return;
        }
        if (!accessToken) {
            navigate('/login');
            return;
        }

        // 장바구니를 건드리지 않고 지금 고른 옵션/수량만 바로 결제로 넘김.
        // (장바구니에 addToCart로 담으면 같은 옵션이 이미 있을 때 수량이 합쳐져서
        //  장바구니에 있던 수량까지 같이 결제돼버리는 문제가 있었음)
        navigate('/checkout', {
            state: {
                directItem: {
                    stockId: selectedStock.stockId,
                    quantity: cartQuantity,
                    productName: productData.name,
                    thumbnailUrl: productData.images[0]?.imageUrl ?? null,
                    color: selectedColor,
                    size: selectedSize,
                    finalPrice: productData.finalPrice,
                },
            },
        });
    };

    const handleToggleRestockNotification = async () => {
        if (!accessToken) {
            navigate('/login');
            return;
        }
        if (!selectedStock) return;
        setRestockSubmitting(true);
        try {
            if (restockRequested) {
                await cancelRestockNotification(selectedStock.stockId);
                setRestockRequested(false);
            } else {
                await requestRestockNotification(selectedStock.stockId);
                setRestockRequested(true);
            }
        } catch (error: any) {
            setCartError(error.response?.data?.message ?? '재입고 알림 신청에 실패했습니다');
        } finally {
            setRestockSubmitting(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!accessToken) {
            navigate('/login');
            return;
        }
        const isWishlisted = wishlistItems.some((item) => item.productId === Number(productId));
        if (isWishlisted) {
            await removeWishlist(Number(productId));
        } else {
            await addWishlist(Number(productId));
        }
    };

    const handleOpenReviewForm = () => {
        if (!accessToken) {
            navigate('/login');
            return;
        }
        if (reviewableItems.length === 0) return;
        setSelectedOrderItemId(reviewableItems.length === 1 ? reviewableItems[0].orderItemId : '');
        setReviewRating(5);
        setReviewContent('');
        setReviewSubmitError('');
        setReviewImageFiles([]);
        setShowReviewForm(true);
    };

    const handleSubmitReview = async () => {
        setReviewSubmitError('');

        if (!selectedOrderItemId) {
            setReviewSubmitError('리뷰를 작성할 상품을 선택해주세요');
            return;
        }
        if (!reviewContent.trim()) {
            setReviewSubmitError('리뷰 내용을 입력해주세요');
            return;
        }

        setReviewSubmitting(true);
        try {
            const created = await createReview({
                orderItemId: Number(selectedOrderItemId),
                rating: reviewRating,
                content: reviewContent,
            });
            if (reviewImageFiles.length > 0) {
                await uploadReviewImages(created.reviewId, reviewImageFiles);
            }
            setShowReviewForm(false);
            setReviewImageFiles([]);
            setReviewPage(0);
            await Promise.all([
                fetchReviews(Number(productId), 0, `${reviewSort},desc`),
                fetchReviewSummary(Number(productId)),
                fetchReviewableItems(Number(productId)),
            ]);
        } catch (error: any) {
            setReviewSubmitError(error.response?.data?.message ?? '리뷰 작성에 실패했습니다');
        } finally {
            setReviewSubmitting(false);
        }
    };

    return   (<div className="bg-canvas min-h-screen">
        {/* 이미지 영역 강조 레이아웃 (7:3 비율에 가깝게 조정) */}
        <section className="max-w-[1440px] mx-auto px-12 py-16 grid grid-cols-[1.3fr_0.7fr] gap-16">

            {/* [왼쪽] 대형 이미지 영역 */}
            <div className="flex gap-6">
                {/* 서브 이미지: 최대 5개까지, 위에서부터 채워짐 (justify-between으로 늘어나지 않게) */}
                <div className="flex flex-col justify-start gap-3 w-[120px] shrink-0">
                    {productData.images.slice(0, 5).map((img, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setMainImage(img.imageUrl)} // 클릭 대신 마우스만 올려도 바뀌게 하면 더 힙함
                            className={`aspect-square w-full rounded-lg overflow-hidden cursor-pointer transition-all border-2
                                ${mainImage === img ? 'border-coral opacity-100' : 'border-transparent opacity-60'}`}
                        >
                            <img src={"/api"+img.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* 메인 썸네일: 5:5 비율(aspect-square)로 큼직하게 배치 */}
                <div
                    onClick={() => setZoomImageUrl(mainImage)}
                    className="group relative max-h-[688px] flex-1 aspect-square bg-canvas rounded-2xl overflow-hidden border border-line shadow-sm cursor-zoom-in"
                >
                    <img
                        src={"/api"+mainImage}
                        alt="main"
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute bottom-4 right-4 p-2 bg-surface/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-ink-soft" />
                    </div>
                </div>
            </div>

            {zoomImageUrl && (
                <div
                    onClick={() => setZoomImageUrl(null)}
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
                >
                    <button
                        onClick={() => setZoomImageUrl(null)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={"/api"+zoomImageUrl}
                        alt="zoomed"
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                    />
                </div>
            )}

            {/* [오른쪽] 정보 구매 영역 */}
            <div className="flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-coral-deep text-sm font-bold tracking-widest uppercase mb-1">Alive Kids</p>
                        <h1 className="font-display text-4xl font-semibold text-ink tracking-tight">{productData.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleToggleWishlist} className="p-3 rounded-full hover:bg-surface transition-colors">
                            <Heart
                                className={`w-5 h-5 ${wishlistItems.some((item) => item.productId === Number(productId)) ? 'text-coral fill-coral' : 'text-ink-soft'}`}
                            />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                    <span className="text-3xl font-[900] text-ink">{productData.finalPrice}원</span>
                    {productData.discountRate != null && (<><span className="text-xl font-bold text-coral-deep">{productData.discountRate}%</span>
                        <span className="text-sm text-ink-soft/50 line-through">{productData.price}원</span></>)}


                </div>

                {/* 깔끔한 옵션 선택 */}
                <div className="space-y-6 mb-12">
                    <div className="group">
                        <label className="block text-[11px] font-black text-ink-soft mb-2 tracking-widest group-focus-within:text-ink transition-colors uppercase">Color</label>
                        <select
                            className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral transition-all bg-transparent cursor-pointer"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            <option value="">색상을 선택해주세요</option>
                            {availableColors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-[11px] font-black text-ink-soft mb-2 tracking-widest group-focus-within:text-ink transition-colors uppercase">Size</label>
                        <select
                            className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral transition-all bg-transparent cursor-pointer"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            <option value="">사이즈를 선택해주세요</option>
                            {availableSizes.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    {selectedStock && selectedStock.quantity === 0 && (
                        <div className="group">
                            <p className="text-xs font-black text-coral-deep uppercase tracking-widest mb-3">품절된 옵션입니다</p>
                            <button
                                onClick={handleToggleRestockNotification}
                                disabled={restockSubmitting}
                                className={`h-12 px-6 rounded-full text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${restockRequested ? 'bg-surface text-ink-soft border border-line' : 'bg-coral text-white hover:bg-coral-deep'}`}
                            >
                                {restockRequested ? '재입고 알림 신청 취소' : '재입고 알림 신청'}
                            </button>
                        </div>
                    )}
                    {selectedStock && selectedStock.quantity > 0 && (
                        <div className="group">
                            <label className="block text-[11px] font-black text-ink-soft mb-2 tracking-widest uppercase">Quantity ({selectedStock.quantity}개 남음)</label>
                            <input
                                type="number"
                                min={1}
                                max={selectedStock.quantity}
                                value={cartQuantity}
                                onChange={(e) => setCartQuantity(Math.max(1, Math.min(selectedStock.quantity, Number(e.target.value))))}
                                className="w-24 border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral transition-all bg-transparent"
                            />
                        </div>
                    )}
                    {cartError && (
                        <p className="text-xs font-bold text-red-500">{cartError}</p>
                    )}
                </div>

                {/* 버튼 세트 */}
                <div className="grid grid-cols-2 gap-4 h-16">
                    <button
                        onClick={handleBuyNow}
                        className="bg-coral text-white font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-coral-deep transition-all flex items-center justify-center gap-2"
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="bg-surface border border-line text-ink font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-canvas transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" /> Cart
                    </button>
                </div>
            </div>
        </section>

        {/* 스티키 메뉴 (상단 고정) */}
        <nav className="sticky top-14 z-40 bg-surface/80 backdrop-blur-md border-b border-line shadow-sm">
            <div className="max-w-7xl mx-auto px-12 flex justify-center">
                {quickMenus.map((menu) => (
                    <button
                        key={menu.name}
                        onClick={() => scrollToSection(menu.ref)}
                        className="px-12 py-6 text-[12px] font-black text-ink-soft hover:text-ink tracking-[0.15em] relative group"
                    >
                        {menu.name}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-coral transition-all group-hover:w-full" />
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
                <div className="w-full rounded-2xl overflow-hidden bg-canvas">
                    <img src={"/api"+productData.images[0].imageUrl} alt="Main Wear" className="w-full object-cover" />
                </div>

                {/* 전후좌우 4컷 그리드 */}
                <div className="grid grid-cols-4 gap-4">
                    {productData.images && productData.images.map((img, i) =>
                        <img key={i} src={"/api"+img.imageUrl} alt="Front" className="w-full rounded-xl bg-canvas" />
                    )}
                </div>
            </section>

            {/* 2. 모델 정보 스펙 보드: 세련된 박스 디자인 */}
            <section className="bg-surface border border-line rounded-2xl p-10 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-coral-deep uppercase tracking-[0.2em]">Model Info</span>
                    <h4 className="text-xl font-black text-ink">MODEL {productData.modelInfo.modelName}</h4>
                </div>
                <div className="flex gap-12">
                    {[
                        { label: 'HEIGHT', value: `${productData.modelInfo.height}` },
                        { label: 'WEIGHT', value: `${productData.modelInfo.weight}` },
                        { label: 'SIZE', value: `${productData.modelInfo.wearingSize}` },
                        { label: 'COLOR', value: `${productData.modelInfo.wearingColor}` },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-ink-soft">{item.label}</span>
                            <span className="text-sm font-black text-ink">{item.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. 상품 설명: 타이포그래피 강조 */}
            <section className="py-10 text-center space-y-8">
                <div className="inline-block border-b-2 border-coral pb-2">
                    <h3 className="font-display text-2xl font-semibold tracking-tight italic text-ink">Product Comment</h3>
                </div>
                <p className="text-lg text-ink-soft leading-[1.8] max-w-2xl mx-auto font-medium">
                    {productData.description}
                </p>
            </section>

        </div>
        {/* 가이드 영역 */}
        <div className="max-w-7xl mx-auto py-32 border-t border-line" ref={guideRef}>
            <h3 className="font-display text-3xl font-semibold mb-16 tracking-tight uppercase text-ink">Shopping Guide.</h3>

            <div className="flex flex-col gap-32">
                {/* 사이즈 가이드 섹션 */}
                <div>
                    <h4 className="text-sm font-black text-ink border-l-4 border-coral pl-4 tracking-widest uppercase">Size Guide</h4>

                    {/* 상의 사이즈 가이드 */}
                    <div className="grid grid-cols-[0.5fr_1.5fr] gap-20 items-center">
                        <div className="rounded-2xl p-8">
                            <img src={topSize} />
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-line/30 text-ink-soft font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-4 px-6 text-left">Size (상의)</th>
                                <th className="py-4 px-6">어깨너비</th>
                                <th className="py-4 px-6">가슴단면</th>
                                <th className="py-4 px-6">소매길이</th>
                                <th className="py-4 px-6">총길이</th>
                            </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-line">
                            {['100', '110', '120'].map(size => (
                                <tr key={size} className="hover:bg-canvas transition-colors">
                                    <td className="py-5 px-6 text-left font-black text-ink">{size}</td>
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
                            <thead className="bg-line/30 text-ink-soft font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-4 px-6 text-left">Size (하의)</th>
                                <th className="py-4 px-6">허리단면</th>
                                <th className="py-4 px-6">힙단면</th>
                                <th className="py-4 px-6">허벅지단면</th>
                                <th className="py-4 px-6">총길이</th>
                            </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-line">
                            {['100', '110', '120'].map(size => (
                                <tr key={size} className="hover:bg-canvas transition-colors">
                                    <td className="py-5 px-6 text-left font-black text-ink">{size}</td>
                                    <td>24</td><td>34</td><td>18</td><td>55</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 배송/교환 가이드 섹션 */}
                <div className="grid grid-cols-2 gap-16 pt-16 border-t border-line">
                    <div className="space-y-6">
                        <h4 className="font-black text-ink text-sm tracking-widest uppercase">Delivery Info</h4>
                        <div className="bg-surface border border-line p-8 rounded-2xl text-sm text-ink-soft leading-relaxed space-y-2">
                            <p>• 기본배송료는 3,000원이며 50,000원 이상 구매 시 무료배송입니다.</p>
                            <p>• 제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
                            <p>• 배송은 결제 확인 후 2-5일(영업일 기준) 정도 소요됩니다.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-black text-ink text-sm tracking-widest uppercase">Return & Exchange</h4>
                        <div className="bg-surface border border-line p-8 rounded-2xl text-sm text-ink-soft leading-relaxed space-y-2">
                            <p>• 교환/반품은 상품 수령 후 7일 이내에 신청 가능합니다.</p>
                            <p>• 단순 변심으로 인한 교환/반품 시 왕복 배송비는 고객 부담입니다.</p>
                            <p>• 상품의 텍(Tag) 제거 또는 착용 흔적이 있을 경우 교환/반품이 불가합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 구매후기 영역 */}
        <div className="max-w-7xl mx-auto py-32 border-t border-line" ref={reviewRef}>
            <div className="flex justify-between items-center mb-16">
                <div className="flex items-end gap-4">
                    <h3 className="font-display text-3xl font-semibold tracking-tight uppercase text-ink">User Reviews</h3>
                    <span className="text-xl font-bold text-coral-deep">{reviewSummary?.totalCount ?? 0}건</span>
                </div>
            </div>

            {/* 리뷰 통계 대시보드 영역 */}
            <div className="bg-surface border border-line rounded-3xl p-12 grid grid-cols-[1fr_2fr] gap-20 mb-20 items-center">
                {/* 왼쪽: 평균 별점 */}
                <div className="flex flex-col items-center justify-center border-r border-line">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl font-black text-ink leading-none">
                            {(reviewSummary?.averageRating ?? 0).toFixed(1)}
                        </span>
                        <div className="flex flex-col">
                            <div className="flex text-butter text-2xl">★★★★★</div>
                            <p className="text-sm font-bold text-ink-soft mt-1">리뷰 {reviewSummary?.totalCount ?? 0}개</p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenReviewForm}
                        disabled={!!accessToken && reviewableItems.length === 0}
                        className="mt-8 w-full max-w-[200px] h-14 bg-coral text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-coral-deep transition-all disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed"
                    >
                        내 리뷰 작성하기
                    </button>
                    {accessToken && reviewableItems.length === 0 && (
                        <p className="text-xs text-ink-soft mt-3 text-center">배송 완료된 구매 내역이 있어야 리뷰를 작성할 수 있어요</p>
                    )}
                </div>

                {/* 오른쪽: 점수별 그래프 */}
                <div className="flex flex-col gap-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewSummary?.ratingCounts?.[star] ?? 0;
                        const total = reviewSummary?.totalCount ?? 0;
                        return (
                            <div key={star} className="grid grid-cols-[80px_1fr_60px] items-center gap-6">
                                <span className="text-xs font-bold text-ink-soft">★ {star}</span>
                                <div className="h-2 bg-line rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-butter transition-all duration-1000"
                                        style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-xs font-black text-ink text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 리뷰 작성 폼 */}
            {showReviewForm && (
                <div className="bg-surface border border-line rounded-2xl p-8 mb-16 space-y-4">
                    {reviewableItems.length > 1 && (
                        <select
                            className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none bg-transparent"
                            value={selectedOrderItemId}
                            onChange={(e) => setSelectedOrderItemId(Number(e.target.value))}
                        >
                            <option value="">리뷰를 작성할 상품을 선택해주세요</option>
                            {reviewableItems.map((item) => (
                                <option key={item.orderItemId} value={item.orderItemId}>
                                    {item.productName} ({item.color} / {item.size})
                                </option>
                            ))}
                        </select>
                    )}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`text-3xl ${star <= reviewRating ? 'text-butter' : 'text-line'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="상품에 대한 솔직한 후기를 남겨주세요"
                        rows={4}
                        className="w-full rounded-xl border border-line p-4 text-sm outline-none focus:border-coral transition-all"
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setReviewImageFiles(Array.from(e.target.files ?? []).slice(0, 5))}
                            className="text-xs text-ink-soft"
                        />
                        <p className="text-[11px] text-ink-soft mt-1">사진은 최대 5장까지 첨부할 수 있어요 ({reviewImageFiles.length}/5)</p>
                    </div>
                    {reviewSubmitError && <p className="text-xs font-bold text-red-500">{reviewSubmitError}</p>}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowReviewForm(false)}
                            className="px-6 py-3 text-xs font-black text-ink-soft uppercase tracking-widest"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmitReview}
                            disabled={reviewSubmitting}
                            className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            등록하기
                        </button>
                    </div>
                </div>
            )}

            {/* 리뷰 정렬 탭 */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex gap-6">
                    {[{ label: '최신순', value: 'createdAt' as const }, { label: '별점순', value: 'rating' as const }].map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => { setReviewSort(tab.value); setReviewPage(0); }}
                            className={`text-sm font-bold transition-colors ${reviewSort === tab.value ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 텍스트 리뷰 리스트 */}
            {reviews.length === 0 ? (
                <p className="py-20 text-center text-sm font-bold text-ink-soft">아직 등록된 리뷰가 없습니다</p>
            ) : (
                <div className="border-t border-ink">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="py-10 border-b border-line grid grid-cols-[1fr_3fr] gap-10">
                            <div className="flex flex-col gap-2">
                                <div className="flex text-butter text-xs">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                <span className="text-sm font-black text-ink">{review.userName}</span>
                                <span className="text-xs text-ink-soft">{new Date(review.createdAt).toLocaleDateString('ko-KR')}{review.size ? ` | ${review.size} 구매` : ''}</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-ink leading-relaxed">
                                    {review.content}
                                </p>
                                {review.imageUrls.length > 0 && (
                                    <div className="flex gap-2">
                                        {review.imageUrls.map((url, i) => (
                                            <img
                                                key={i}
                                                src={`/api${url}`}
                                                alt="review"
                                                className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                                                onClick={() => setZoomImageUrl(url)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 페이징 버튼 */}
            {reviewTotalPages > 1 && (
                <div className="flex justify-center mt-16 gap-2">
                    {Array.from({ length: reviewTotalPages }, (_, n) => n).map(n => (
                        <button
                            key={n}
                            onClick={() => setReviewPage(n)}
                            className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === reviewPage ? 'bg-coral text-white' : 'text-ink-soft hover:bg-surface'}`}
                        >
                            {n + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* 추천상품 섹션 */}
        {relatedProducts.length > 0 && (
            <div className="max-w-7xl mx-auto py-24 border-t border-line mb-40" ref={realatedRef}>
                <h3 className="font-display text-2xl font-semibold mb-12 tracking-tight text-ink">Related Items.</h3>
                <div className="grid grid-cols-5 gap-6">
                    {relatedProducts.map((product) => (
                        <div
                            key={product.productId}
                            onClick={() => navigate(`/product/detail/${product.productId}`)}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-canvas">
                                <img src={"/api"+product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="text-sm font-bold text-ink">{product.name}</h4>
                            <p className="text-sm font-black text-ink mt-1">{product.finalPrice.toLocaleString()}원</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>)
};

export default ProductDetail;