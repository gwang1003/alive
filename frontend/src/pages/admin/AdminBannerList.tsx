import React, { useEffect, useState } from 'react';
import useBannerStore from '../../store/bannerStore';
import AdminNav from '../../components/AdminNav';

// 관리자 배너 등록/활성화 토글/삭제 목록 페이지
const AdminBannerList: React.FC = () => {
    const { adminBanners, isLoading, fetchAdminBanners, createBanner, updateBanner, deleteBanner } = useBannerStore();

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAdminBanners();
    }, []);

    // 이미지 필수 검증 후 배너 등록, 성공 시 폼 초기화
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setError('배너 이미지를 선택해주세요');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            await createBanner(title, linkUrl, displayOrder, image);
            setShowForm(false);
            setTitle('');
            setLinkUrl('');
            setDisplayOrder(0);
            setImage(null);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '배너 등록에 실패했습니다');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (bannerId: number, currentActive: boolean) => {
        await updateBanner(bannerId, { isActive: !currentActive });
    };

    const handleDelete = async (bannerId: number) => {
        if (!window.confirm('이 배너를 삭제하시겠습니까?')) return;
        await deleteBanner(bannerId);
    };

    return (
        <div className="min-h-screen bg-canvas px-12 py-16">
            <div className="max-w-4xl mx-auto">
                <AdminNav />
                <div className="flex justify-between items-center mb-12">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">배너 관리</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all"
                    >
                        배너 등록
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-8 mb-10 space-y-4">
                        <input
                            placeholder="배너 제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                            required
                        />
                        <input
                            placeholder="링크 URL (선택, 예: /sale)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                        />
                        <input
                            type="number"
                            placeholder="노출 순서 (낮을수록 먼저)"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(Number(e.target.value))}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                            className="text-xs text-ink-soft"
                        />
                        {error && <p className="text-xs font-bold text-red-500">{error}</p>}
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-xs font-black text-ink-soft uppercase tracking-widest">
                                취소
                            </button>
                            <button type="submit" disabled={submitting} className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50">
                                저장
                            </button>
                        </div>
                    </form>
                )}

                {isLoading && adminBanners.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && adminBanners.length === 0 && !showForm && (
                    <p className="text-ink-soft text-center py-32">등록된 배너가 없습니다.</p>
                )}

                <div className="space-y-4">
                    {adminBanners.map((banner) => (
                        <div key={banner.bannerId} className="border border-line rounded-2xl p-6 flex gap-6 items-center">
                            <img src={`/api${banner.imageUrl}`} alt={banner.title} className="w-32 h-20 object-cover rounded-xl bg-canvas" />
                            <div className="flex-1">
                                <p className="text-sm font-black text-ink">{banner.title}</p>
                                <p className="text-xs text-ink-soft">{banner.linkUrl || '링크 없음'} · 순서 {banner.displayOrder}</p>
                            </div>
                            <button
                                onClick={() => handleToggleActive(banner.bannerId, banner.isActive)}
                                className={`text-[10px] font-black px-3 py-1 rounded-full border ${banner.isActive ? 'text-green-600 border-green-200 bg-green-50' : 'text-ink-soft border-line bg-line/20'}`}
                            >
                                {banner.isActive ? '활성' : '비활성'}
                            </button>
                            <button onClick={() => handleDelete(banner.bannerId)} className="text-[11px] font-bold text-coral-deep hover:underline">
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminBannerList;
