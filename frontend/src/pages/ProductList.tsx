import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { PageResponse, ProductListItem } from '../types/product';

interface ProductListProps {
    title: string;
    categoryId?: number;
    defaultSort?: string;
    discountedOnly?: boolean;
}

const SORT_OPTIONS = [
    { label: '최신순', value: 'createdAt,desc' },
    { label: '인기순', value: 'viewCount,desc' },
    { label: '가격낮은순', value: 'price,asc' },
    { label: '가격높은순', value: 'price,desc' },
];

const GENDER_OPTIONS = [
    { label: '전체', value: '' },
    { label: '남아', value: 'MALE' },
    { label: '여아', value: 'FEMALE' },
    { label: '공용', value: 'UNISEX' },
];

const ProductList: React.FC<ProductListProps> = ({ title, categoryId, defaultSort = 'createdAt,desc', discountedOnly = false }) => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [sort, setSort] = useState(defaultSort);
    const [gender, setGender] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [keyword, setKeyword] = useState(() => searchParams.get('keyword') ?? '');

    useEffect(() => {
        setPage(0);
    }, [categoryId, title]);

    // 헤더 검색으로 진입할 때(?keyword=)마다 검색어 반영
    useEffect(() => {
        const urlKeyword = searchParams.get('keyword');
        if (urlKeyword !== null) {
            setKeyword(urlKeyword);
            setPage(0);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                if (discountedOnly) {
                    const response = await axios.get<PageResponse<ProductListItem>>('/products/discounted', {
                        params: { page, size: 20 },
                    });
                    setProducts(response.data.content);
                    setTotalPages(response.data.totalPages);
                    return;
                }

                const response = await axios.get<PageResponse<ProductListItem>>('/products', {
                    params: {
                        page,
                        size: 20,
                        sort,
                        categoryId,
                        gender: gender || undefined,
                        minPrice: minPrice || undefined,
                        maxPrice: maxPrice || undefined,
                        minAge: minAge || undefined,
                        maxAge: maxAge || undefined,
                        keyword: keyword || undefined,
                    },
                });
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId, discountedOnly, page, sort, gender, minPrice, maxPrice, minAge, maxAge, keyword]);

    const handleFilterChange = () => setPage(0);

    return (
        <div className="min-h-screen bg-canvas px-12 py-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-10">{title}</h1>

                {!discountedOnly && (
                    <div className="flex flex-wrap items-end gap-6 mb-12 pb-8 border-b border-line">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-ink-soft uppercase tracking-widest">성별</label>
                            <select
                                className="border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                value={gender}
                                onChange={(e) => { setGender(e.target.value); handleFilterChange(); }}
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-ink-soft uppercase tracking-widest">가격 범위</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="최소"
                                    className="w-24 border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); handleFilterChange(); }}
                                />
                                <span className="text-ink-soft/50">~</span>
                                <input
                                    type="number"
                                    placeholder="최대"
                                    className="w-24 border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); handleFilterChange(); }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-ink-soft uppercase tracking-widest">연령(개월)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="최소"
                                    className="w-20 border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                    value={minAge}
                                    onChange={(e) => { setMinAge(e.target.value); handleFilterChange(); }}
                                />
                                <span className="text-ink-soft/50">~</span>
                                <input
                                    type="number"
                                    placeholder="최대"
                                    className="w-20 border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                    value={maxAge}
                                    onChange={(e) => { setMaxAge(e.target.value); handleFilterChange(); }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-ink-soft uppercase tracking-widest">키워드</label>
                            <input
                                type="text"
                                placeholder="상품명 검색"
                                className="w-40 border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                value={keyword}
                                onChange={(e) => { setKeyword(e.target.value); handleFilterChange(); }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 ml-auto">
                            <label className="text-[10px] font-black text-ink-soft uppercase tracking-widest">정렬</label>
                            <select
                                className="border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); handleFilterChange(); }}
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {isLoading && products.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && products.length === 0 && (
                    <p className="text-ink-soft text-center py-32">조건에 맞는 상품이 없습니다.</p>
                )}

                <div className="grid grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-16 gap-2">
                        {Array.from({ length: totalPages }, (_, n) => n).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === page ? 'bg-coral text-white' : 'text-ink-soft hover:bg-surface'}`}
                            >
                                {n + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
