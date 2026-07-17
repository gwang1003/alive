import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from '../api/axios';

const FindEmail: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult('');
        setSubmitting(true);
        try {
            const response = await axios.post('/auth/find-email', formData);
            setResult(response.data.maskedEmail);
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
                    <p className="text-xs font-bold text-ink-soft tracking-[0.3em] uppercase">Find Email</p>
                </div>

                {result ? (
                    <div className="space-y-8 text-center">
                        <p className="text-sm text-ink-soft">회원님의 이메일입니다.</p>
                        <p className="text-lg font-black text-ink">{result}</p>
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

                        {error && <p className="text-xs font-bold text-coral-deep">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all disabled:opacity-50"
                        >
                            {submitting ? '확인 중...' : '이메일 찾기'}
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

export default FindEmail;
