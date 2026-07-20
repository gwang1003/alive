import React, { useEffect, useState } from 'react';
import useInquiryStore from '../../store/inquiryStore';
import { InquiryStatus } from '../../types/inquiry';
import AdminNav from '../../components/AdminNav';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '답변 대기',
    ANSWERED: '답변 완료',
};

// 관리자 1:1 문의 목록 조회 및 답변 등록 페이지
const AdminInquiryList: React.FC = () => {
    const { adminInquiries, adminTotalPages, adminPage, isLoading, fetchAdminInquiries, answerInquiry } = useInquiryStore();
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAdminInquiries(0, statusFilter || undefined);
    }, [statusFilter]);

    // 문의 항목 펼침/접기 토글, 전환 시 답변 입력값 초기화
    const handleExpand = (inquiryId: number) => {
        setExpandedId(expandedId === inquiryId ? null : inquiryId);
        setAnswerText('');
    };

    // 답변 등록 후 펼침 상태와 입력값 초기화
    const handleAnswer = async (inquiryId: number) => {
        if (!answerText.trim()) return;
        setSubmitting(true);
        try {
            await answerInquiry(inquiryId, answerText);
            setExpandedId(null);
            setAnswerText('');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-12 py-16">
            <div className="max-w-4xl mx-auto">
                <AdminNav />
                <div className="flex justify-between items-center mb-10">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">1:1 문의 관리</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | '')}
                        className="border-b-2 border-line py-2 text-sm font-bold outline-none bg-transparent"
                    >
                        <option value="">전체</option>
                        <option value="PENDING">답변 대기</option>
                        <option value="ANSWERED">답변 완료</option>
                    </select>
                </div>

                {isLoading && adminInquiries.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && adminInquiries.length === 0 && (
                    <p className="text-ink-soft text-center py-32">문의가 없습니다.</p>
                )}

                <div className="divide-y divide-line border-t border-ink">
                    {adminInquiries.map((inquiry) => (
                        <div key={inquiry.inquiryId} className="py-6">
                            <div onClick={() => handleExpand(inquiry.inquiryId)} className="flex justify-between items-center cursor-pointer">
                                <div className="flex gap-4 items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'ANSWERED' ? 'text-[#5B7A3A]' : 'text-coral-deep'}`}>
                                        {STATUS_LABEL[inquiry.status]}
                                    </span>
                                    <span className="text-sm font-bold text-ink">{inquiry.title}</span>
                                    <span className="text-xs text-ink-soft">{inquiry.userName}</span>
                                </div>
                                <span className="text-xs text-ink-soft">{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {expandedId === inquiry.inquiryId && (
                                <div className="mt-4 pl-4 border-l-2 border-line space-y-4">
                                    <p className="text-sm text-ink-soft whitespace-pre-wrap">{inquiry.content}</p>
                                    {inquiry.answer ? (
                                        <div className="bg-surface border border-line rounded-xl p-4">
                                            <p className="text-xs font-black text-ink-soft mb-1">답변</p>
                                            <p className="text-sm text-ink-soft whitespace-pre-wrap">{inquiry.answer}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <textarea
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                                placeholder="답변을 입력해주세요"
                                                rows={4}
                                                className="w-full rounded-xl border border-line p-4 text-sm outline-none focus:border-coral"
                                            />
                                            <button
                                                onClick={() => handleAnswer(inquiry.inquiryId)}
                                                disabled={submitting}
                                                className="px-6 py-2 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                                            >
                                                답변 등록
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {adminTotalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: adminTotalPages }, (_, n) => n).map((n) => (
                            <button
                                key={n}
                                onClick={() => fetchAdminInquiries(n, statusFilter || undefined)}
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === adminPage ? 'bg-coral text-white' : 'text-ink-soft hover:bg-surface'}`}
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

export default AdminInquiryList;
