import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from "../api/axios";
import useAuthStore from "../assets/authStore";




const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const login = useAuthStore((state) => state.login);
    // 6년 차 짬바: 핸들러 하나로 여러 input 관리하기
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', formData);

            // 1. 데이터 추출 (백엔드 응답 구조 확인 필수!)
            const accessToken = response.data.token;

            // 2. Zustand 상태 업데이트
            login(accessToken, response.data);

            // 3. 페이지 이동 (성공 시에만 이동하도록 try-catch 안으로)
            navigate('/');
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 정보를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-[400px] space-y-12">
                {/* 로고 영역 */}
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={aliveLogo}
                        alt="Alive Logo"
                        className="h-10 cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                    <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Welcome Back</p>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 계정"
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            className="w-full h-14 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors text-sm font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="w-full h-16 bg-gray-900 text-white font-black text-xs tracking-[0.2em] uppercase mt-8 hover:bg-black transition-all">
                        Login
                    </button>
                </form>

                {/* 보조 메뉴 */}
                <div className="flex justify-center gap-6 text-[11px] font-bold text-gray-400">
                    <button className="hover:text-gray-900">아이디 찾기</button>
                    <span className="text-gray-200">|</span>
                    <button className="hover:text-gray-900">비밀번호 찾기</button>
                    <span className="text-gray-200">|</span>
                    <button
                        className="text-gray-900"
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </button>
                </div>

                {/* 소셜 로그인 (학습용으로 딱임) */}
                <div className="pt-10 border-t border-gray-50 space-y-4">
                    <button className="w-full h-14 bg-[#FEE500] text-gray-900 font-bold text-[13px] rounded-xl flex items-center justify-center gap-3">
                        {/* 카카오 아이콘 생략 */}
                        카카오 로그인
                    </button>
                    <button className="w-full h-14 border border-gray-200 text-gray-900 font-bold text-[13px] rounded-xl flex items-center justify-center gap-3">
                        네이버 로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;