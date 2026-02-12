import React, { useState, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Type, User, Upload, X } from 'lucide-react';

interface DetailBlock {
    id: string;
    type: 'IMAGE' | 'TEXT';
    file?: File;         // 실제 서버로 보낼 파일
    preview?: string;    // 화면에 보여줄 프리뷰 URL
    value?: string;      // TEXT 타입일 때 내용
}

// ... 기존 interface에 description 추가
interface ProductState {
    name: string;
    price: number;
    introTitle: string;    // 메인 설명 제목 (예: "프리미엄 코튼의 부드러움")
    introSubTitle: string; // 메인 설명 부제목 (예: 2026 S/S New Collection)
    mainDescription: string; // 메인 긴 설명
    // ... 나머지
}

const ProductForm: React.FC = () => {
    const [mainImage, setMainImage] = useState<{file: File, preview: string} | null>(null);
    const [thumbnails, setThumbnails] = useState<{id: string, file: File, preview: string}[]>([]);
    const [detailBlocks, setDetailBlocks] = useState<DetailBlock[]>([]);

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
        if (mainImage) formData.append('mainImage', mainImage.file);
        thumbnails.forEach(t => formData.append('thumbnails', t.file));

        // 블록 데이터는 JSON 문자열로 변환해서 전송 (자바에서 DTO로 매핑 가능)
        const blocksData = detailBlocks.map(b => ({
            type: b.type,
            text: b.value,
            // 파일은 따로 보내고 순서만 맞춤
        }));
        formData.append('productData', new Blob([JSON.stringify(blocksData)], {type: 'application/json'}));

        console.log("FormData 구성 완료! Axios.post 쏠 준비 끝.");
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
                            <h2 className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Main Description</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <textarea
                                    placeholder="상품에 대한 전반적인 스토리텔링을 입력해주세요. 이 내용은 상세페이지 최상단에 노출됩니다."
                                    className="w-full bg-gray-50 border-none rounded-3xl p-8 text-sm leading-relaxed outline-none focus:ring-2 ring-gray-100 transition-all min-h-[180px] resize-none"
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

                {/* 3. 사이드바 (모델 정보 & 기본 스펙) */}
                <aside className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-32 space-y-10">
                        {/* 모델 정보 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <User size={16} className="text-gray-900" />
                                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Model Specification</h3>
                            </div>
                            <div className="grid gap-4">
                                {['Name', 'Height', 'Weight', 'Wearing Size'].map(label => (
                                    <div key={label} className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
                                        <input type="text" className="w-full border-b py-1 text-sm font-bold outline-none focus:border-black" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 상품 기본 정보 */}
                        <div className="space-y-6 pt-6 border-t border-gray-50">
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Pricing & Name</h3>
                            <input type="text" placeholder="상품명" className="w-full border-b py-2 text-sm font-bold outline-none focus:border-black" />
                            <input type="number" placeholder="판매가 (₩)" className="w-full border-b py-2 text-sm font-bold outline-none focus:border-black" />
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ProductForm;