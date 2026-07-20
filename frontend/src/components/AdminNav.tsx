import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
    { name: '상품 관리', path: '/admin/products' },
    { name: '주문 관리', path: '/admin/orders' },
    { name: '배너 관리', path: '/admin/banners' },
    { name: '문의 관리', path: '/admin/inquiries' },
];

// 관리자 페이지 상단 탭 네비게이션(현재 경로에 따라 활성 탭 강조)
const AdminNav: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="flex gap-6 mb-10 border-b border-line pb-4">
            {LINKS.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-black uppercase tracking-widest ${location.pathname.startsWith(link.path) ? 'text-coral-deep' : 'text-ink-soft hover:text-ink'}`}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
};

export default AdminNav;
