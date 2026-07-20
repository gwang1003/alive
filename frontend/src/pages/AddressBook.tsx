import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAddressStore from '../store/addressStore';
import useAuthStore from '../assets/authStore';
import { Address } from '../types/address';
import { formatPhoneNumber } from '../utils/phone';
import PostcodeSearchModal from '../components/PostcodeSearchModal';

const EMPTY_FORM = { recipientName: '', phone: '', zipcode: '', address: '', addressDetail: '', isDefault: false };

// 배송지 목록 조회/추가/수정/삭제 및 기본 배송지 설정 페이지
const AddressBook: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefault } = useAddressStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPostcodeSearch, setShowPostcodeSearch] = useState(false);

    // 로그인 확인 후 배송지 목록 조회, 미로그인 시 로그인 페이지로 이동
    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    // input 통합 핸들러 — 전화번호 필드는 자동 포맷팅 적용
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (name === 'phone') {
            setForm((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // 우편번호 검색 완료 시 zipcode/address 반영 후 모달 닫기
    const handlePostcodeComplete = ({ zonecode, address }: { zonecode: string; address: string }) => {
        setForm((prev) => ({ ...prev, zipcode: zonecode, address }));
        setShowPostcodeSearch(false);
    };

    const openAddForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
        setShowForm(true);
    };

    const openEditForm = (addr: Address) => {
        setEditingId(addr.addressId);
        setForm({
            recipientName: addr.recipientName,
            phone: addr.phone,
            zipcode: addr.zipcode,
            address: addr.address,
            addressDetail: addr.addressDetail ?? '',
            isDefault: addr.isDefault,
        });
        setError('');
        setShowForm(true);
    };

    // 수정 모드(editingId 존재)면 updateAddress, 아니면 addAddress 호출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            if (editingId) {
                await updateAddress(editingId, form);
            } else {
                await addAddress(form);
            }
            setShowForm(false);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '저장에 실패했습니다');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (addressId: number) => {
        if (!window.confirm('이 배송지를 삭제하시겠습니까?')) return;
        await deleteAddress(addressId);
    };

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">배송지 관리</h1>
                    <button
                        onClick={openAddForm}
                        className="px-6 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all"
                    >
                        배송지 추가
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-8 mb-10 space-y-4">
                        <input
                            name="recipientName"
                            placeholder="받는 분 성함"
                            value={form.recipientName}
                            onChange={handleChange}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                            required
                        />
                        <input
                            name="phone"
                            placeholder="연락처 (예: 010-1234-5678)"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                            required
                        />
                        <div className="flex gap-2">
                            <input
                                name="zipcode"
                                placeholder="우편번호"
                                value={form.zipcode}
                                readOnly
                                className="flex-1 h-12 border-b border-line bg-transparent outline-none text-sm text-ink-soft"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPostcodeSearch(true)}
                                className="shrink-0 px-4 text-[11px] font-bold text-ink-soft border-b border-line hover:text-coral-deep whitespace-nowrap"
                            >
                                우편번호 찾기
                            </button>
                        </div>
                        <input
                            name="address"
                            placeholder="주소"
                            value={form.address}
                            readOnly
                            className="w-full h-12 border-b border-line bg-transparent outline-none text-sm text-ink-soft"
                            required
                        />
                        <input
                            name="addressDetail"
                            placeholder="상세주소 (선택)"
                            value={form.addressDetail}
                            onChange={handleChange}
                            className="w-full h-12 border-b border-line bg-transparent outline-none focus:border-coral text-sm"
                        />
                        <label className="flex items-center gap-2 text-sm text-ink-soft">
                            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                            기본 배송지로 설정
                        </label>
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

                {isLoading && addresses.length === 0 && <p className="text-sm text-ink-soft">불러오는 중...</p>}
                {!isLoading && addresses.length === 0 && !showForm && (
                    <p className="text-ink-soft text-center py-32">등록된 배송지가 없습니다.</p>
                )}

                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.addressId} className="border border-line rounded-2xl p-6 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-black text-ink">{addr.recipientName}</span>
                                    {addr.isDefault && (
                                        <span className="text-[10px] font-black text-white bg-coral px-2 py-0.5 rounded-full">기본</span>
                                    )}
                                </div>
                                <p className="text-xs text-ink-soft mb-1">{addr.phone}</p>
                                <p className="text-sm text-ink-soft">({addr.zipcode}) {addr.address} {addr.addressDetail}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end shrink-0">
                                {!addr.isDefault && (
                                    <button onClick={() => setDefault(addr.addressId)} className="text-[11px] font-bold text-ink-soft hover:underline">
                                        기본으로 설정
                                    </button>
                                )}
                                <button onClick={() => openEditForm(addr)} className="text-[11px] font-bold text-sky hover:underline">
                                    수정
                                </button>
                                <button onClick={() => handleDelete(addr.addressId)} className="text-[11px] font-bold text-coral-deep hover:underline">
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPostcodeSearch && (
                <PostcodeSearchModal
                    onComplete={handlePostcodeComplete}
                    onClose={() => setShowPostcodeSearch(false)}
                />
            )}
        </div>
    );
};

export default AddressBook;
