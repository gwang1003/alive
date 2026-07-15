import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Search, User, ShoppingBag, Heart, X } from 'lucide-react';
import logo from '../assets/logo.png';
import useCartStore from '../store/cartStore';
import useAuthStore from '../assets/authStore';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
    const isAdmin = useAuthStore((state) => state.user?.role === 'ADMIN');
    const accessToken = useAuthStore((state) => state.accessToken);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const categories = [
        { name: 'NEW', path: '/new' },
        { name: 'BEST', path: '/best' },
        { name: 'TOP', path: '/tops' },
        { name: 'BOTTOM', path: '/bottoms' },
        { name: 'SETS', path: '/sets' },
        { name: 'OUTER', path: '/outer' },
        { name: 'SALE', path: '/sale', isPoint: true },
    ];

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => {
        setSearchOpen(false);
        setSearchKeyword('');
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const keyword = searchKeyword.trim();
            if (!keyword) return;
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
            closeSearch();
        } else if (e.key === 'Escape') {
            closeSearch();
        }
    };

    return (
        <header className="w-full h-12 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-12 flex items-center justify-between border-b border-gray-50">

            {/* 왼쪽: 로고 이미지 영역 */}
            <Link to="/" className="flex items-center h-full">
                {/* 여기에 가져오실 이미지를 넣으세요 */}
                <img src={logo} alt="ALIVE KIDS" className="h-full w-auto object-contain" />
                <div className="h-10 w-auto flex items-center justify-center">
                    {/* 예시: <img src={logoImg} alt="ALIVE KIDS" className="h-full w-auto object-contain" /> */}
                    <span className="text-2xl font-black tracking-tighter text-gray-900">
            <span className="text-red-500">ALIVE</span>
          </span>
                </div>
            </Link>

            {/* 중앙: 네비게이션 메뉴 */}
            {searchOpen ? (
                <div className="flex-1 flex items-center gap-3 px-12">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="상품명을 검색해보세요"
                        className="flex-1 h-9 border-b border-gray-200 outline-none focus:border-gray-900 text-sm bg-transparent"
                    />
                    <button onClick={closeSearch} className="shrink-0 text-gray-400 hover:text-gray-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <nav className="flex items-center gap-10">
                    {categories.map((menu) => (
                        <Link
                            key={menu.name}
                            to={menu.path}
                            className={`text-[14px] font-bold tracking-tight transition-colors hover:text-red-500 relative group
              ${menu.isPoint ? 'text-red-500' : 'text-gray-700'}
            `}
                        >
                            {menu.name}
                            {/* 호버 시 나타나는 아주 얇은 언더라인 */}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-red-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>
            )}

            {/* 오른쪽: 유틸리티 아이콘 */}
            <div className="flex items-center gap-6 text-gray-400">
                {!searchOpen && (
                    <Search
                        onClick={openSearch}
                        className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-gray-900 transition-colors"
                    />
                )}
                {isAdmin && (
                    <Link to="/admin/orders" className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors">관리자</Link>
                )}
                <Link to="/inquiries" className="text-[11px] font-bold hover:text-gray-900 transition-colors">1:1 문의</Link>
                <button onClick={() => navigate(accessToken ? '/mypage' : '/login')}>
                    <User className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-gray-900 transition-colors"/>
                </button>
                <Link to="/wishlist" className="text-gray-400 hover:text-gray-900">
                    <Heart className="w-5 h-5 stroke-[1.5px] transition-colors" />
                </Link>
                <Link to="/cart" className="relative group text-gray-400 hover:text-gray-900">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5px] transition-colors" />
                    <span className="absolute -top-1 -right-1.5 bg-gray-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
            {cartCount}
          </span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
