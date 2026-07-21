import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from "../api/axios";

// 이메일 인증 페이지: 가입 시 발송된 6자리 코드를 입력해 계정을 활성화한다.
// 이메일은 가입/로그인 화면에서 navigate state로 전달받으며, 직접 접근 시엔 직접 입력한다.
const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = (location.state as { email?: string } | null)?.email ?? '';

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('가입하신 이메일로 6자리 인증코드를 보냈습니다. (10분 내 입력)');

    // 6자리 코드를 서버에 검증 요청하고, 성공하면 로그인 화면으로 이동
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/auth/verify-email', { email, code });
            alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message ?? '인증 중 오류가 발생했습니다.');
        }
    };

    // 인증코드 재발송
    const handleResend = async () => {
        setError('');
        setInfo('');
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }
        try {
            await axios.post('/auth/resend-verification', { email });
            setInfo('인증코드를 재발송했습니다. 메일함을 확인해주세요.');
        } catch (err: any) {
            setError(err.response?.data?.message ?? '재발송 중 오류가 발생했습니다.');
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
                    <p className="text-xs font-bold text-ink-soft tracking-[0.3em] uppercase">Verify Email</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 계정"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="text"
                            name="code"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="인증코드 6자리"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-lg font-bold tracking-[0.4em]"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                        />
                    </div>

                    {info && !error && (
                        <p className="text-[12px] font-bold text-ink-soft">{info}</p>
                    )}
                    {error && (
                        <p className="text-[12px] font-bold text-red-500">{error}</p>
                    )}

                    <button
                        disabled={code.length !== 6}
                        className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        인증하기
                    </button>
                </form>

                <div className="flex justify-center gap-6 text-[11px] font-bold text-ink-soft">
                    <button type="button" className="hover:text-ink" onClick={handleResend}>인증코드 재발송</button>
                    <span className="text-line">|</span>
                    <button type="button" className="text-ink" onClick={() => navigate('/login')}>로그인으로</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
