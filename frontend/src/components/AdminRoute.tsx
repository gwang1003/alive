import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../assets/authStore';

interface AdminRouteProps {
    children: React.ReactNode;
}

// role이 ADMIN인 사용자만 children을 렌더링하는 라우트 가드.
// authChecked가 아직 false면(초기 인증 확인 중) 아무것도 렌더링하지 않고,
// 확인 완료 후 관리자가 아니면 홈으로 리다이렉트한다.
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const authChecked = useAuthStore((state) => state.authChecked);
    const user = useAuthStore((state) => state.user);

    if (!authChecked) {
        return null;
    }

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
