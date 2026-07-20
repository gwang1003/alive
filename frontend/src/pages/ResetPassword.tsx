import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from '../api/axios';

// 이름+이메일+전화번호로 본인확인 후 새 비밀번호로 재설정하는 페이지 (별도 인증 없이 필드 매칭만 수행)
const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', name: '', phone: '', newPassword: '' });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 새 비밀번호 확인 일치 검증 후 본인확인 정보와 함께 비밀번호 재설정을 요청한다
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== passwordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/auth/reset-password', formData);
            setDone(true);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '일치하는 회원 정보가 없습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-[400px] space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={aliveLogo}
                        alt="Alive Logo"
                        className="h-10 cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                    <p className="text-xs font-bold text-ink-soft tracking-[0.3em] uppercase">Reset Password</p>
                </div>

                {done ? (
                    <div className="space-y-8 text-center">
                        <p className="text-sm text-ink-soft">비밀번호가 재설정되었습니다.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-coral-deep transition-all"
                        >
                            로그인하러 가기
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 계정"
                                value={formData.email}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="phone"
                                placeholder="가입 시 등록한 전화번호"
                                value={formData.phone}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="새 비밀번호 (8자 이상)"
                                value={formData.newPassword}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="새 비밀번호 확인"
                                value={passwordConfirm}
                                className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        {error && <p className="text-xs font-bold text-coral-deep">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            {submitting ? '처리 중...' : '비밀번호 재설정'}
                        </button>
                    </form>
                )}

                <div className="flex justify-center gap-6 text-[11px] font-bold text-ink-soft">
                    <button className="hover:text-ink" onClick={() => navigate('/login')}>로그인으로 돌아가기</button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
