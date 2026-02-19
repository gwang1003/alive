import React, {useState, useRef, useEffect} from 'react';
import { Plus, Trash2, Image as ImageIcon, Type, User, Upload, X } from 'lucide-react';
import axios from "../../api/axios.ts";

const tempCategories = [
    { id: 1, name: 'Outer' },
    { id: 2, name: 'Top' },
    { id: 3, name: 'Pants' },
    { id: 4, name: 'Acc' }
];

enum gender {
    'MAIL' = 'MAIL',
    'FEMAIL' = 'FEMAIL',
    'UNISEX' = 'UNISEX'
}

interface DetailBlock {
    id: string;
    type: 'IMAGE' | 'TEXT';
    file?: File;         // 실제 서버로 보낼 파일
    preview?: string;    // 화면에 보여줄 프리뷰 URL
    value?: string;      // TEXT 타입일 때 내용
}

// 재고 아이템 타입
interface StockItem {
    color: string;
    size: string;
    quantity: number;
}

// 옵션 타입 정의
interface ProductOption {
    colors: string[];
    sizes: string[];
}

interface ModelInfo {
    modelName: string;
    height: number;
    weight: number;
    wearingColor: string;
    wearingSize: number;
}

// ... 기존 interface에 description 추가
interface ProductState {
    name: string;
    mainDescription: string; // 메인 긴 설명
    price: number;
    categoryId: number;
    gender: 'MALE' | 'FAMALE' | 'UNISEX' | '';
    modelInfo: ModelInfo;
    // ... 나머지
}

const ProductForm: React.FC = () => {
    const [mainImage, setMainImage] = useState<{file: File, preview: string} | null>(null);
    const [thumbnails, setThumbnails] = useState<{id: string, file: File, preview: string}[]>([]);
    const [detailBlocks, setDetailBlocks] = useState<DetailBlock[]>([]);
    // 상태 관리 (형의 6년차 짬바를 위해 구조를 잡았습니다)
    const [options, setOptions] = useState<ProductOption>({
        colors: [], // 초기 기본값 예시
        sizes: []
    });

    // [핵심] 조합된 재고 데이터 상태
    const [stocks, setStocks] = useState<StockItem[]>([]);

    const [modelInfo, setModelInfo] = useState<ModelInfo>({modelName: '', height: 0, weight: 0, wearingSize: 0, wearingColor: '' })

    const [product, setProduct] = useState<ProductState>({
        name: '',
        price: 0,
        mainDescription: '',
        modelInfo: modelInfo, // size, color 추가
        gender : '',
        categoryId : 0
    });

    // 컬러나 사이즈가 변경될 때마다 재고 조합 자동 생성
    useEffect(() => {
        const newStocks: StockItem[] = [];
        options.colors.forEach(color => {
            options.sizes.forEach(size => {
                // 기존에 입력했던 재고 값이 있으면 유지, 없으면 0으로 초기화
                const existing = stocks.find(s => s.color === color && s.size === size);
                newStocks.push({
                    color,
                    size,
                    quantity: existing ? existing.quantity : 0
                });
            });
        });
        setStocks(newStocks);
    }, [options.colors, options.sizes]);

    // 특정 조합의 재고 수정
    const updateStockQuantity = (index: number, qty: number) => {
        const nextStocks = [...stocks];
        nextStocks[index].quantity = qty;
        setStocks(nextStocks);
    };

    // 옵션 추가 핸들러
    const addOption = (type: 'colors' | 'sizes', value: string) => {
        if (!value) return;
        setOptions(prev => ({ ...prev, [type]: [...prev[type], value] }));
    };

    const removeOption = (type: 'colors' | 'sizes', index: number) => {
        setOptions(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    // 1. 메인 이미지 업로드 핸들러
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImage({ file, preview: URL.createObjectURL(file) });
        }
    };

    // 2. 썸네일 추가 핸들러 (N개)
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newThumbs = files.map(file => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file)
        }));
        setThumbnails(prev => [...prev, ...newThumbs]);
    };

    // 3. 상세 블록(이미지/텍스트) 추가
    const addBlock = (type: 'IMAGE' | 'TEXT') => {
        setDetailBlocks(prev => [...prev, { id: crypto.randomUUID(), type, value: '' }]);
    };

    const updateBlockFile = (id: string, file: File) => {
        setDetailBlocks(prev => prev.map(b =>
            b.id === id ? { ...b, file, preview: URL.createObjectURL(file) } : b
        ));
    };

    const updateBlockText = (id: string, value: string) => {
        setDetailBlocks(prev => prev.map(b => b.id === id ? { ...b, value } : b));
    };

    // 4. 서버 전송 (FormData 사용)
    const handleSubmit = async () => {
        const formData = new FormData();

        // 1. 메인 이미지 추가
        if (mainImage) {
            formData.append('mainImage', mainImage.file);
        }

        // 2. 썸네일 이미지들 추가 (같은 키값으로 여러 번 append하면 리스트로 들어감)
        thumbnails.forEach(thumb => {
            formData.append('thumbnails', thumb.file);
        });

        // 3. 디테일 뷰 파일들 (순서 보장을 위해 별도 리스트로 관리)
        detailBlocks.forEach(block => {
            if (block.type === 'IMAGE' && block.file) {
                formData.append('detailFiles', block.file);
            }
        });

        // 4. 텍스트 데이터 및 메타정보 통합 (JSON)
        const productData = {
            ...product,
            modelInfo,
            options,
            stocks,
            detailBlocks: detailBlocks.map((block, index) => ({
                type: block.type,
                value: block.value || '', // TEXT면 내용, IMAGE면 나중에 서버에서 채움
                displayOrder: index
            }))
        };

        // JSON 객체를 Blob으로 변환하여 추가 (Content-Type 지정 필수)
        formData.append('productData', new Blob([JSON.stringify(productData)], {
            type: 'application/json'
        }));

        try {
            const response = await axios.post('/admin/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('상품 등록 성공!');
        } catch (error) {
            console.error('등록 실패:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-50 px-12 py-6 flex justify-between items-center">
                <h1 className="text-xl font-black italic uppercase">Admin : Product Enrollment</h1>
                <button onClick={handleSubmit} className="bg-black text-white px-10 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Save Product
                </button>
            </header>

            <main className="max-w-6xl mx-auto mt-12 grid grid-cols-[1fr_400px] gap-12 px-6">
                <div className="space-y-10">

                    {/* 1. 상품 옵션 설정 (컬러 & 사이즈) */}
                    <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-8">Product Options</h2>
                        <div className="grid grid-cols-2 gap-12">
                            {/* 컬러 옵션 */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-900 uppercase">Available Colors</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {options.colors.map((color, i) => (
                                        <span key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-bold">
                                            {color}
                                            <button onClick={() => removeOption('colors', i)} className="text-gray-400 hover:text-red-500"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="컬러 추가 후 Enter"
                                        className="w-full border-b py-2 text-sm outline-none focus:border-black pr-10"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addOption('colors', (e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                    <Plus size={16} className="absolute right-2 top-2 text-gray-400" />
                                </div>
                            </div>

                            {/* 사이즈 옵션 */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-900 uppercase">Available Sizes</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {options.sizes.map((size, i) => (
                                        <span key={i} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold">
                      {size}
                                            <button onClick={() => removeOption('sizes', i)} className="text-gray-500 hover:text-white"><X size={12}/></button>
                    </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="사이즈 추가 후 Enter"
                                        className="w-full border-b py-2 text-sm outline-none focus:border-black pr-10"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addOption('sizes', (e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                    <Plus size={16} className="absolute right-2 top-2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. 재고 수량 관리 섹션 */}
                    <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Inventory Management</h2>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 italic">* 옵션을 변경하면 조합이 자동 갱신됩니다.</p>
                        </div>

                        <div className="overflow-hidden border border-gray-100 rounded-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Color</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Size</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase w-40">Stock Quantity</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {stocks.map((stock, idx) => (
                                    <tr key={`${stock.color}-${stock.size}`} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-900">{stock.color}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">{stock.size}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={stock.quantity}
                                                onChange={(e) => updateStockQuantity(idx, parseInt(e.target.value) || 0)}
                                                className="w-full border-b border-gray-200 py-1 text-sm font-bold outline-none focus:border-blue-600 transition-colors"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {stock.quantity === 0 ? (
                                                <span className="text-[10px] font-bold text-red-400">품절 예정</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-green-500">판매 가능</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 이미지 에셋 섹션 */}
                    <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-8">Image Assets</h2>
                        <div className="grid grid-cols-2 gap-10">
                            {/* 메인 이미지 업로드 */}
                            <div className="space-y-4">
                                <span className="text-xs font-black text-gray-900 uppercase">Main Image</span>
                                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 overflow-hidden relative">
                                    {mainImage ? (
                                        <img src={mainImage.preview} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <Upload size={30} />
                                            <span className="text-[10px] font-bold mt-2">Click to Upload</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleMainImageChange} accept="image/*" />
                                </label>
                            </div>

                            {/* 썸네일 이미지 업로드 (N개) */}
                            <div className="space-y-4">
                                <span className="text-xs font-black text-gray-900 uppercase">Thumbnails (Multiple)</span>
                                <div className="grid grid-cols-2 gap-4">
                                    {thumbnails.map((t, idx) => (
                                        <div key={t.id} className="relative aspect-square rounded-2xl overflow-hidden border">
                                            <img src={t.preview} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setThumbnails(prev => prev.filter(item => item.id !== t.id))}
                                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50">
                                        <Plus size={24} className="text-gray-300" />
                                        <input type="file" className="hidden" multiple onChange={handleThumbnailChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* [신규 추가] 상품 메인 스토리 섹션 */}
                    <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-black rounded-full" />
                            <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Title & Description</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <span className="text-xs font-black text-gray-900 uppercase">TITLE</span>
                                <input type="text" className="w-full border-b py-1 text-sm font-bold outline-none focus:border-black" placeholder="상품명을 입력해 주세요."
                                       onChange={(e) => setProduct({...product, name: e.target.value})}/>
                                {/*<textarea*/}
                                {/*    placeholder="상품명을 입력해 주세요."*/}
                                {/*    className="w-full bg-gray-50 border-none rounded-3xl p-4 text-sm leading-relaxed h-14 outline-none focus:ring-2 ring-gray-100 transition-all min-h-[30px] resize-none"*/}
                                {/*    onChange={(e) => setProduct({...product, mainDescription: e.target.value})}*/}
                                {/*/>*/}
                            </div>
                        </div>
                        <div className="space-y-8 pt-5">
                            <div className="space-y-2">
                                <span className="text-xs font-black text-gray-900 uppercase">DESCRIPTION</span>
                                <textarea
                                    placeholder="상품에 대한 전반적인 스토리텔링을 입력해주세요. 이 내용은 상세페이지 최상단에 노출됩니다."
                                    className="w-full bg-gray-50 border-none rounded-3xl p-4 text-sm leading-relaxed outline-none focus:ring-2 ring-gray-100 transition-all min-h-[180px] resize-none"
                                    onChange={(e) => setProduct({...product, mainDescription: e.target.value})}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 그 아래에 기존 Detail View Builder (이미지 위주) 섹션이 오면 됨 */}

                    {/* 상세 설명 & 디테일 뷰 빌더 */}
                    <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-8">Product Story & Detail Views</h2>
                        <div className="space-y-6">
                            {detailBlocks.map((block) => (
                                <div key={block.id} className="relative p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 group">
                                    <button
                                        onClick={() => setDetailBlocks(prev => prev.filter(b => b.id !== block.id))}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    {block.type === 'IMAGE' ? (
                                        <div className="flex flex-col items-center">
                                            <label className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                                {block.preview ? (
                                                    <img src={block.preview} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-gray-300 flex flex-col items-center">
                                                        <ImageIcon size={24} />
                                                        <span className="text-[10px] font-bold mt-2">Detail Image Upload</span>
                                                    </div>
                                                )}
                                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && updateBlockFile(block.id, e.target.files[0])} />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description Text</span>
                                            <textarea
                                                className="w-full bg-white border border-gray-200 rounded-xl p-6 text-sm outline-none focus:border-black min-h-[120px]"
                                                placeholder="상세한 상품 설명을 적어주세요."
                                                onChange={(e) => updateBlockText(block.id, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => addBlock('IMAGE')} className="flex-1 h-14 border-2 border-gray-100 rounded-2xl text-xs font-black text-gray-400 hover:border-black hover:text-black transition-all">+ ADD DETAIL IMAGE</button>
                                <button onClick={() => addBlock('TEXT')} className="flex-1 h-14 border-2 border-gray-100 rounded-2xl text-xs font-black text-gray-400 hover:border-black hover:text-black transition-all">+ ADD STORY TEXT</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 2. 사이드바: 모델 정보 (셀렉트 박스 포함) */}
                <aside className="space-y-8">
                    {/* 사이드바 내부: Category & Gender */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Classification</h3>
                        </div>

                        <div className="space-y-6">
                            {/* 카테고리 선택 */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Category</label>
                                <select
                                    className="w-full border-b py-2 text-sm font-bold outline-none bg-transparent appearance-none focus:border-black transition-colors"
                                    value={product.categoryId}
                                    onChange={(e) => setProduct({...product, categoryId: Number(e.target.value)})}
                                >
                                    <option value="">카테고리 선택</option>
                                    {tempCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 성별 선택 (버튼 그룹 스타일) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Gender</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: '남아', value: 'MALE' },
                                        { label: '여아', value: 'FEMALE' },
                                        { label: '공용', value: 'UNISEX' }
                                    ].map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => setProduct({...product, gender: item.value as any})}
                                            className={`py-3 rounded-xl text-xs font-bold transition-all ${
                                                product.gender === item.value
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-32 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <User size={16} className="text-gray-900" />
                                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Model Information</h3>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Model Name</label>
                                    <input type="text" className="w-full border-b py-1 text-sm font-bold outline-none focus:border-black"
                                           onChange={(e) => setModelInfo({...modelInfo, modelName: e.target.value})}/>
                                </div>

                                {/* [중요] 동적 셀렉트 박스: 등록된 컬러 옵션 사용 */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Wearing Color</label>
                                    <select className="w-full border-b py-2 text-sm font-bold outline-none bg-transparent appearance-none"
                                            onChange={(e) => setModelInfo({...modelInfo, wearingColor: e.target.value})}>
                                        <option value="">컬러 선택</option>
                                        {options.colors.map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* [중요] 동적 셀렉트 박스: 등록된 사이즈 옵션 사용 */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Wearing Size</label>
                                    <select className="w-full border-b py-2 text-sm font-bold outline-none bg-transparent appearance-none"
                                            onChange={(e) => setModelInfo({...modelInfo, wearingSize: Number(e.target.value)})}>
                                        <option value="">사이즈 선택</option>
                                        {options.sizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Height</label>
                                        <input type="text" placeholder="ex) 110cm" className="w-full border-b py-1 text-sm font-bold outline-none focus:border-black"
                                               onChange={(e) => setModelInfo({...modelInfo, height: Number(e.target.value)})}/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Weight</label>
                                        <input type="text" placeholder="ex) 19kg" className="w-full border-b py-1 text-sm font-bold outline-none focus:border-black"
                                               onChange={(e) => setModelInfo({...modelInfo, weight: Number(e.target.value)})}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 상품 기본 정보 */}
                        <div className="space-y-6 pt-6 border-t border-gray-50">
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Pricing</h3>
                            <input type="number" placeholder="판매가 (₩)" className="w-full border-b py-2 text-sm font-bold outline-none focus:border-black"
                                   onChange={(e) => setProduct({...product, price: e.target.value})}/>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ProductForm;