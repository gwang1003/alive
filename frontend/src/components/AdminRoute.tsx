import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../assets/authStore';

interface AdminRouteProps {
    children: React.ReactNode;
}

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
