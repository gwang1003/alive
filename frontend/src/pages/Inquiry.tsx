import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInquiryStore from '../store/inquiryStore';
import useAuthStore from '../assets/authStore';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '답변 대기',
    ANSWERED: '답변 완료',
};

const Inquiry: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { inquiries, isLoading, fetchInquiries, createInquiry } = useInquiryStore();

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchInquiries();
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await createInquiry({ title, content });
            setShowForm(false);
            setTitle('');
            setContent('');
        } catch (err: any) {
            setError(err.response?.data?.message ?? '문의 등록에 실패했습니다');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">1:1 문의</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all"
                    >
                        문의하기
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-8 mb-10 space-y-4">
                        <input
                            placeholder="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                            required
                        />
                        <textarea
                            placeholder="문의 내용을 입력해주세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className="w-full rounded-xl border border-line p-4 text-sm outline-none focus:border-coral"
                            required
                        />
                        {error && <p className="text-xs font-bold text-red-500">{error}</p>}
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-xs font-black text-ink-soft uppercase tracking-widest">
                                취소
                            </button>
                            <button type="submit" disabled={submitting} className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50">
                                등록하기
                            </button>
                        </div>
                    </form>
                )}

                {isLoading && inquiries.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && inquiries.length === 0 && !showForm && (
                    <p className="text-ink-soft text-center py-32">등록한 문의가 없습니다.</p>
                )}

                <div className="divide-y divide-line border-t border-ink">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry.inquiryId} className="py-6">
                            <div
                                onClick={() => setExpandedId(expandedId === inquiry.inquiryId ? null : inquiry.inquiryId)}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <div className="flex gap-4 items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'ANSWERED' ? 'text-[#5B7A3A]' : 'text-ink-soft'}`}>
                                        {STATUS_LABEL[inquiry.status]}
                                    </span>
                                    <span className="text-sm font-bold text-ink">{inquiry.title}</span>
                                </div>
                                <span className="text-xs text-ink-soft">{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {expandedId === inquiry.inquiryId && (
                                <div className="mt-4 pl-4 border-l-2 border-line space-y-4">
                                    <p className="text-sm text-ink-soft whitespace-pre-wrap">{inquiry.content}</p>
                                    {inquiry.answer && (
                                        <div className="bg-surface border border-line rounded-xl p-4">
                                            <p className="text-xs font-black text-ink-soft mb-1">답변</p>
                                            <p className="text-sm text-ink-soft whitespace-pre-wrap">{inquiry.answer}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inquiry;
