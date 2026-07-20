import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../assets/authStore';
import useCartStore from '../store/cartStore';
import { formatPhoneNumber } from '../utils/phone';

interface Profile {
    userId: number;
    email: string;
    name: string;
    phone: string | null;
    role: string;
    createdAt: string;
}

// 마이페이지: 회원정보/비밀번호 수정, 로그아웃, 주문/배송지/위시리스트 등 하위 메뉴 진입점
const MyPage: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const logout = useAuthStore((state) => state.logout);
    const clearCart = useCartStore((state) => state.clearCart);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    // authChecked를 기다린 뒤 로그인 여부 확인하고 프로필을 조회해 폼에 채운다
    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        axios.get('/users/me').then((res) => {
            setProfile(res.data);
            setProfileForm({ name: res.data.name, phone: res.data.phone ?? '' });
        });
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setProfileForm((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
            return;
        }
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    // 이름/전화번호 수정사항을 서버에 반영한다
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setSavingProfile(true);
        try {
            const res = await axios.patch('/users/me', profileForm);
            setProfile(res.data);
            setProfileSuccess('회원정보가 수정되었습니다.');
        } catch (err: any) {
            setProfileError(err.response?.data?.message ?? '수정에 실패했습니다.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    // 새 비밀번호 확인 일치 검증 후 비밀번호 변경 요청을 보낸다
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
            setPasswordError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setSavingPassword(true);
        try {
            await axios.patch('/users/me/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordSuccess('비밀번호가 변경되었습니다.');
            setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
        } catch (err: any) {
            setPasswordError(err.response?.data?.message ?? '비밀번호 변경에 실패했습니다.');
        } finally {
            setSavingPassword(false);
        }
    };

    // 서버 로그아웃 성공 여부와 무관하게 클라이언트 인증/장바구니 상태를 정리하고 로그인 페이지로 이동
    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch {
            // 서버 로그아웃 실패해도 클라이언트 상태는 정리
        } finally {
            logout();
            clearCart();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">마이페이지</h1>
                    <button
                        onClick={handleLogout}
                        className="text-[11px] font-bold text-ink-soft hover:text-coral-deep uppercase tracking-widest"
                    >
                        로그아웃
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/orders"
                        className="border border-line rounded-2xl p-6 hover:border-coral transition-all"
                    >
                        <p className="text-sm font-black text-ink">주문내역</p>
                        <p className="text-xs text-ink-soft mt-1">주문 조회 및 취소</p>
                    </Link>
                    <Link
                        to="/addresses"
                        className="border border-line rounded-2xl p-6 hover:border-coral transition-all"
                    >
                        <p className="text-sm font-black text-ink">배송지 관리</p>
                        <p className="text-xs text-ink-soft mt-1">배송지 추가 및 수정</p>
                    </Link>
                    <Link
                        to="/wishlist"
                        className="border border-line rounded-2xl p-6 hover:border-coral transition-all"
                    >
                        <p className="text-sm font-black text-ink">위시리스트</p>
                        <p className="text-xs text-ink-soft mt-1">찜한 상품 보기</p>
                    </Link>
                    <Link
                        to="/inquiries"
                        className="border border-line rounded-2xl p-6 hover:border-coral transition-all"
                    >
                        <p className="text-sm font-black text-ink">1:1 문의</p>
                        <p className="text-xs text-ink-soft mt-1">문의 내역 확인</p>
                    </Link>
                    <Link
                        to="/notifications"
                        className="border border-line rounded-2xl p-6 hover:border-coral transition-all"
                    >
                        <p className="text-sm font-black text-ink">재입고 알림함</p>
                        <p className="text-xs text-ink-soft mt-1">신청한 재입고 알림 확인</p>
                    </Link>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xs font-black text-ink-soft tracking-widest uppercase">회원정보 수정</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                type="email"
                                value={profile?.email ?? ''}
                                readOnly
                                className="w-full h-14 border-b border-line outline-none text-sm font-medium text-ink-soft"
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="phone"
                                placeholder="휴대폰번호 (예: 010-1234-5678)"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            />
                        </div>
                        {profileError && <p className="text-xs font-bold text-red-500">{profileError}</p>}
                        {profileSuccess && <p className="text-xs font-bold text-sage">{profileSuccess}</p>}
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            저장
                        </button>
                    </form>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xs font-black text-ink-soft tracking-widest uppercase">비밀번호 변경</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="현재 비밀번호"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="새 비밀번호 (8자 이상)"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                minLength={8}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="newPasswordConfirm"
                                placeholder="새 비밀번호 확인"
                                value={passwordForm.newPasswordConfirm}
                                onChange={handlePasswordChange}
                                minLength={8}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        {passwordError && <p className="text-xs font-bold text-red-500">{passwordError}</p>}
                        {passwordSuccess && <p className="text-xs font-bold text-sage">{passwordSuccess}</p>}
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            비밀번호 변경
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default MyPage;
