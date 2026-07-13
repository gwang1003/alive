import React, { useEffect, useState } from 'react';
import useInquiryStore from '../../store/inquiryStore';
import { InquiryStatus } from '../../types/inquiry';
import AdminNav from '../../components/AdminNav';

const STATUS_LABEL: Record<string, string> = {
    PENDING: '답변 대기',
    ANSWERED: '답변 완료',
};

const AdminInquiryList: React.FC = () => {
    const { adminInquiries, adminTotalPages, adminPage, isLoading, fetchAdminInquiries, answerInquiry } = useInquiryStore();
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAdminInquiries(0, statusFilter || undefined);
    }, [statusFilter]);

    const handleExpand = (inquiryId: number) => {
        setExpandedId(expandedId === inquiryId ? null : inquiryId);
        setAnswerText('');
    };

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
        <div className="min-h-screen bg-white px-12 py-16">
            <div className="max-w-4xl mx-auto">
                <AdminNav />
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-black tracking-tighter">1:1 문의 관리</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | '')}
                        className="border-b-2 border-gray-100 py-2 text-sm font-bold outline-none bg-transparent"
                    >
                        <option value="">전체</option>
                        <option value="PENDING">답변 대기</option>
                        <option value="ANSWERED">답변 완료</option>
                    </select>
                </div>

                {isLoading && adminInquiries.length === 0 && <p className="text-sm text-gray-400">불러오는 중...</p>}
                {!isLoading && adminInquiries.length === 0 && (
                    <p className="text-gray-400 text-center py-32">문의가 없습니다.</p>
                )}

                <div className="divide-y divide-gray-100 border-t border-gray-900">
                    {adminInquiries.map((inquiry) => (
                        <div key={inquiry.inquiryId} className="py-6">
                            <div onClick={() => handleExpand(inquiry.inquiryId)} className="flex justify-between items-center cursor-pointer">
                                <div className="flex gap-4 items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'ANSWERED' ? 'text-blue-600' : 'text-red-500'}`}>
                                        {STATUS_LABEL[inquiry.status]}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">{inquiry.title}</span>
                                    <span className="text-xs text-gray-400">{inquiry.userName}</span>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {expandedId === inquiry.inquiryId && (
                                <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.content}</p>
                                    {inquiry.answer ? (
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-black text-gray-400 mb-1">답변</p>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.answer}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <textarea
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                                placeholder="답변을 입력해주세요"
                                                rows={4}
                                                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-gray-900"
                                            />
                                            <button
                                                onClick={() => handleAnswer(inquiry.inquiryId)}
                                                disabled={submitting}
                                                className="px-6 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50"
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
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === adminPage ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
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
