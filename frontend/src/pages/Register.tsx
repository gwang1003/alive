import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from "../api/axios";
import { formatPhoneNumber } from '../utils/phone';

// 회원가입 페이지: 이메일 중복확인, 비밀번호 확인, 약관 동의를 거쳐 계정을 생성한다
const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
    });
    const [emailChecked, setEmailChecked] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData(prev => ({ ...prev, phone: formatPhoneNumber(value) }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'email') {
            setEmailChecked(false);
        }
    };

    // 입력한 이메일의 중복 여부를 서버에 확인 요청한다
    const handleCheckEmail = async () => {
        if (!formData.email) {
            setError('이메일을 먼저 입력해주세요.');
            return;
        }
        try {
            const response = await axios.get('/auth/check-email', {
                params: { email: formData.email },
            });
            if (response.data === true) {
                setEmailChecked(true);
                setError('');
                alert('사용 가능한 이메일입니다.');
            } else {
                setEmailChecked(false);
                setError('이미 사용 중인 이메일입니다.');
            }
        } catch (err) {
            console.error('이메일 확인 실패:', err);
            setError('이메일 확인 중 오류가 발생했습니다.');
        }
    };

    // 비밀번호 일치 및 약관 동의를 검증한 뒤 회원가입을 요청한다
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreedTerms) {
            setError('이용약관 및 개인정보처리방침에 동의해주세요.');
            return;
        }

        try {
            await axios.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone || undefined,
            });

            alert('가입하신 이메일로 인증코드를 보냈습니다. 인증을 완료해주세요.');
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err: any) {
            console.error('회원가입 실패:', err);
            setError(err.response?.data?.message ?? '회원가입 중 오류가 발생했습니다.');
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
                    <p className="text-xs font-bold text-ink-soft tracking-[0.3em] uppercase">Create Account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 계정"
                                className="flex-1 h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckEmail}
                                className="shrink-0 px-4 text-[11px] font-bold text-ink-soft border-b border-line hover:text-coral-deep whitespace-nowrap"
                            >
                                중복확인
                            </button>
                        </div>
                        {emailChecked && (
                            <p className="text-[11px] font-bold text-sage">사용 가능한 이메일입니다.</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호 (8자 이상)"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호 확인"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="text"
                            name="name"
                            placeholder="이름"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="text"
                            name="phone"
                            placeholder="휴대폰번호 (예: 010-1234-5678)"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="h-28 overflow-y-auto rounded-xl border border-line p-3 text-[11px] leading-relaxed text-ink-soft space-y-2">
                            <p className="font-bold text-ink">이용약관 및 개인정보처리방침 (예시)</p>
                            <p>
                                본 약관은 alive(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및
                                책임사항을 규정함을 목적으로 합니다. 회원은 회사가 정한 절차에 따라 가입을 신청하며, 서비스 이용
                                중 관계 법령 및 회사가 정한 이용약관을 준수해야 합니다.
                            </p>
                            <p>
                                회사는 회원가입 시 수집한 이메일, 이름, 휴대폰번호 등의 개인정보를 서비스 제공, 주문/배송 처리,
                                고객 문의 응대 목적으로만 이용하며, 관련 법령에 따른 보관 기간이 경과하거나 회원 탈퇴 시 지체
                                없이 파기합니다. 회원은 언제든지 자신의 개인정보 처리 현황을 조회하거나 수정을 요청할 수 있습니다.
                            </p>
                            <p className="text-ink-soft/70">
                                ※ 본 문서는 데모/개발 목적의 예시 텍스트이며, 실제 법적 효력을 갖는 약관이 아닙니다.
                            </p>
                        </div>
                        <label className="flex items-center gap-2 text-[12px] font-bold text-ink-soft">
                            <input
                                type="checkbox"
                                checked={agreedTerms}
                                onChange={(e) => setAgreedTerms(e.target.checked)}
                            />
                            이용약관 및 개인정보처리방침에 동의합니다. (필수)
                        </label>
                    </div>

                    {error && (
                        <p className="text-[12px] font-bold text-red-500">{error}</p>
                    )}

                    <button
                        disabled={!agreedTerms}
                        className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="flex justify-center gap-2 text-[11px] font-bold text-ink-soft">
                    <span>이미 계정이 있으신가요?</span>
                    <button
                        className="text-ink"
                        onClick={() => navigate('/login')}
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
