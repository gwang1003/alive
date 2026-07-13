import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
    { name: '상품 관리', path: '/admin/products' },
    { name: '주문 관리', path: '/admin/orders' },
    { name: '배너 관리', path: '/admin/banners' },
];

const AdminNav: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="flex gap-6 mb-10 border-b border-gray-100 pb-4">
            {LINKS.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-black uppercase tracking-widest ${location.pathname.startsWith(link.path) ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
};

export default AdminNav;
