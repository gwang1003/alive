import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from "../api/axios";

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
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'email') {
            setEmailChecked(false);
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axios.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone || undefined,
            });

            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (err: any) {
            console.error('회원가입 실패:', err);
            setError(err.response?.data?.message ?? '회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-[400px] space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={aliveLogo}
                        alt="Alive Logo"
                        className="h-10 cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                    <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Create Account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 계정"
                                className="flex-1 h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckEmail}
                                className="shrink-0 px-4 text-[11px] font-bold text-gray-500 border-b border-gray-200 hover:text-gray-900 whitespace-nowrap"
                            >
                                중복확인
                            </button>
                        </div>
                        {emailChecked && (
                            <p className="text-[11px] font-bold text-blue-600">사용 가능한 이메일입니다.</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호 (8자 이상)"
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
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
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <p className="text-[12px] font-bold text-red-500">{error}</p>
                    )}

                    <button className="w-full h-16 bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase mt-8 hover:bg-black transition-all">
                        Sign Up
                    </button>
                </form>

                <div className="flex justify-center gap-2 text-[11px] font-bold text-gray-400">
                    <span>이미 계정이 있으신가요?</span>
                    <button
                        className="text-gray-900"
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
