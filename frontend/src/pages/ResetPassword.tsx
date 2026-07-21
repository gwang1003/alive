import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from '../api/axios';

// 비밀번호 재설정 페이지. URL에 ?token=... 이 있으면 "새 비밀번호 설정" 단계,
// 없으면 "이메일로 재설정 링크 요청" 단계로 동작한다. (메일 링크 기반, 필드 매칭 방식 폐기)
const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    // 요청 단계
    const [email, setEmail] = useState('');
    const [requested, setRequested] = useState(false);
    // 확인 단계
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [done, setDone] = useState(false);

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 이메일로 재설정 링크 발송 요청 (계정 존재 여부와 무관하게 동일 응답)
    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await axios.post('/auth/password-reset/request', { email });
            setRequested(true);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '요청 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    // 토큰 + 새 비밀번호로 재설정 확정
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== passwordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post('/auth/password-reset/confirm', { token, newPassword });
            setDone(true);
        } catch (err: any) {
            setError(err.response?.data?.message ?? '재설정 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium";
    const primaryBtn = "w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all disabled:opacity-50";

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

                {token ? (
                    // ===== 확인 단계: 새 비밀번호 설정 =====
                    done ? (
                        <div className="space-y-8 text-center">
                            <p className="text-sm text-ink-soft">비밀번호가 재설정되었습니다.</p>
                            <button onClick={() => navigate('/login')} className={primaryBtn}>
                                로그인하러 가기
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleConfirm} className="space-y-4">
                            <input
                                type="password"
                                placeholder="새 비밀번호 (8자 이상)"
                                value={newPassword}
                                className={inputClass}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <input
                                type="password"
                                placeholder="새 비밀번호 확인"
                                value={passwordConfirm}
                                className={inputClass}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                minLength={8}
                                required
                            />
                            {error && <p className="text-xs font-bold text-coral-deep">{error}</p>}
                            <button type="submit" disabled={submitting} className={primaryBtn}>
                                {submitting ? '처리 중...' : '비밀번호 재설정'}
                            </button>
                        </form>
                    )
                ) : (
                    // ===== 요청 단계: 이메일로 링크 발송 =====
                    requested ? (
                        <div className="space-y-8 text-center">
                            <p className="text-sm text-ink-soft leading-relaxed">
                                입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.<br />
                                메일함을 확인해주세요. (10~30분 내 유효)
                            </p>
                            <button onClick={() => navigate('/login')} className={primaryBtn}>
                                로그인으로 돌아가기
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRequest} className="space-y-4">
                            <input
                                type="email"
                                placeholder="가입한 이메일 계정"
                                value={email}
                                className={inputClass}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <p className="text-xs font-bold text-coral-deep">{error}</p>}
                            <button type="submit" disabled={submitting} className={primaryBtn}>
                                {submitting ? '전송 중...' : '재설정 링크 받기'}
                            </button>
                        </form>
                    )
                )}

                <div className="flex justify-center gap-6 text-[11px] font-bold text-ink-soft">
                    <button className="hover:text-ink" onClick={() => navigate('/login')}>로그인으로 돌아가기</button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
