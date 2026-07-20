import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aliveLogo from '../assets/logo.png';
import axios from "../api/axios";
import useAuthStore from "../assets/authStore";
import useCartStore from "../store/cartStore";




// 이메일/비밀번호 로그인 페이지 (카카오/네이버 소셜 로그인 진입점 포함)
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const login = useAuthStore((state) => state.login);
    const fetchCart = useCartStore((state) => state.fetchCart);
    // 6년 차 짬바: 핸들러 하나로 여러 input 관리하기
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 로그인 요청 후 accessToken을 스토어에 저장하고 장바구니를 불러온 뒤 홈으로 이동
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', formData);

            // 1. 데이터 추출 (백엔드 응답 구조 확인 필수!)
            const accessToken = response.data.accessToken;

            // 2. Zustand 상태 업데이트
            login(accessToken, response.data);
            fetchCart();

            // 3. 페이지 이동 (성공 시에만 이동하도록 try-catch 안으로)
            navigate('/');
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 정보를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-[400px] space-y-12">
                {/* 로고 영역 */}
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={aliveLogo}
                        alt="Alive Logo"
                        className="h-10 cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                    <p className="text-xs font-bold text-ink-soft tracking-[0.3em] uppercase">Welcome Back</p>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 계정"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            className="w-full h-14 border-b border-line outline-none focus:border-coral transition-colors text-sm font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="w-full h-16 bg-coral text-white font-black text-xs tracking-[0.2em] uppercase mt-8 rounded-full hover:bg-coral-deep transition-all">
                        Login
                    </button>
                </form>

                {/* 보조 메뉴 */}
                <div className="flex justify-center gap-6 text-[11px] font-bold text-ink-soft">
                    <button className="hover:text-ink" onClick={() => navigate('/find-email')}>아이디 찾기</button>
                    <span className="text-line">|</span>
                    <button className="hover:text-ink" onClick={() => navigate('/reset-password')}>비밀번호 찾기</button>
                    <span className="text-line">|</span>
                    <button
                        className="text-ink"
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </button>
                </div>

                {/* 소셜 로그인 (학습용으로 딱임) */}
                <div className="pt-10 border-t border-line space-y-4">
                    <button
                        className="w-full h-14 bg-[#FEE500] text-ink font-bold text-[13px] rounded-full flex items-center justify-center gap-3"
                        onClick={() => { window.location.href = '/api/auth/oauth/kakao/authorize'; }}
                    >
                        {/* 카카오 아이콘 생략 */}
                        카카오 로그인
                    </button>
                    <button
                        className="w-full h-14 border border-line text-ink font-bold text-[13px] rounded-full flex items-center justify-center gap-3"
                        onClick={() => { window.location.href = '/api/auth/oauth/naver/authorize'; }}
                    >
                        네이버 로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
