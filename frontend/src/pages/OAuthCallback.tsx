import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAuth } from '../api/axios';
import useAuthStore from '../assets/authStore';
import useCartStore from '../store/cartStore';

// 카카오/네이버 로그인 완료 후 백엔드가 RefreshToken 쿠키를 심고 이 페이지로 리다이렉트한다.
// 여기서는 그 쿠키로 AccessToken을 받아와 로그인 상태를 완성하고 홈으로 이동한다.
const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const fetchCart = useCartStore((state) => state.fetchCart);
    const [error, setError] = useState('');

    useEffect(() => {
        const complete = async () => {
            try {
                const { accessToken, user } = await refreshAuth();
                login(accessToken, user);
                fetchCart();
                navigate('/', { replace: true });
            } catch {
                setError('소셜 로그인에 실패했습니다.');
            }
        };
        complete();
    }, []);

    return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-6 px-6 text-center">
            {error ? (
                <>
                    <p className="text-sm font-bold text-coral-deep">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-ink text-white text-xs font-black tracking-widest uppercase rounded-full hover:opacity-80 transition-all"
                    >
                        로그인으로 돌아가기
                    </button>
                </>
            ) : (
                <p className="text-sm font-bold text-ink-soft">로그인 처리 중입니다...</p>
            )}
        </div>
    );
};

export default OAuthCallback;
