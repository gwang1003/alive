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
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tighter">마이페이지</h1>
                    <button
                        onClick={handleLogout}
                        className="text-[11px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest"
                    >
                        로그아웃
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/orders"
                        className="border border-gray-100 rounded-2xl p-6 hover:border-gray-900 transition-all"
                    >
                        <p className="text-sm font-black text-gray-900">주문내역</p>
                        <p className="text-xs text-gray-400 mt-1">주문 조회 및 취소</p>
                    </Link>
                    <Link
                        to="/addresses"
                        className="border border-gray-100 rounded-2xl p-6 hover:border-gray-900 transition-all"
                    >
                        <p className="text-sm font-black text-gray-900">배송지 관리</p>
                        <p className="text-xs text-gray-400 mt-1">배송지 추가 및 수정</p>
                    </Link>
                    <Link
                        to="/wishlist"
                        className="border border-gray-100 rounded-2xl p-6 hover:border-gray-900 transition-all"
                    >
                        <p className="text-sm font-black text-gray-900">위시리스트</p>
                        <p className="text-xs text-gray-400 mt-1">찜한 상품 보기</p>
                    </Link>
                    <Link
                        to="/inquiries"
                        className="border border-gray-100 rounded-2xl p-6 hover:border-gray-900 transition-all"
                    >
                        <p className="text-sm font-black text-gray-900">1:1 문의</p>
                        <p className="text-xs text-gray-400 mt-1">문의 내역 확인</p>
                    </Link>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase">회원정보 수정</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                type="email"
                                value={profile?.email ?? ''}
                                readOnly
                                className="w-full h-14 border-b border-gray-200 outline-none text-sm font-medium text-gray-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                            />
                        </div>
                        {profileError && <p className="text-xs font-bold text-red-500">{profileError}</p>}
                        {profileSuccess && <p className="text-xs font-bold text-blue-600">{profileSuccess}</p>}
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="px-8 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50"
                        >
                            저장
                        </button>
                    </form>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase">비밀번호 변경</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="현재 비밀번호"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                                className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        {passwordError && <p className="text-xs font-bold text-red-500">{passwordError}</p>}
                        {passwordSuccess && <p className="text-xs font-bold text-blue-600">{passwordSuccess}</p>}
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="px-8 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50"
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
