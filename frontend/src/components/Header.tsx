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
        <header className="w-full h-14 bg-surface/90 backdrop-blur-md sticky top-0 z-50 px-12 flex items-center justify-between border-b border-line">

            {/* 왼쪽: 로고 이미지 영역 */}
            <Link to="/" className="flex items-center h-full">
                <img src={logo} alt="ALIVE KIDS" className="h-full w-auto object-contain" />
                <div className="h-10 w-auto flex items-center justify-center">
                    <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            <span className="text-coral">ALIVE</span>
          </span>
                </div>
            </Link>

            {/* 중앙: 네비게이션 메뉴 */}
            {searchOpen ? (
                <div className="flex-1 flex items-center gap-3 px-12">
                    <Search className="w-4 h-4 text-ink-soft shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="상품명을 검색해보세요"
                        className="flex-1 h-9 border-b border-line outline-none focus:border-coral text-sm bg-transparent"
                    />
                    <button onClick={closeSearch} className="shrink-0 text-ink-soft hover:text-ink">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <nav className="flex items-center gap-10">
                    {categories.map((menu) => (
                        <Link
                            key={menu.name}
                            to={menu.path}
                            className={`text-[14px] font-bold tracking-tight transition-colors hover:text-coral-deep relative group
              ${menu.isPoint ? 'text-coral' : 'text-ink-soft'}
            `}
                        >
                            {menu.name}
                            {/* 호버 시 나타나는 아주 얇은 언더라인 */}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-coral transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>
            )}

            {/* 오른쪽: 유틸리티 아이콘 */}
            <div className="flex items-center gap-6 text-ink-soft">
                {!searchOpen && (
                    <Search
                        onClick={openSearch}
                        className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-ink transition-colors"
                    />
                )}
                {isAdmin && (
                    <Link to="/admin/orders" className="text-[11px] font-bold text-coral-deep hover:text-coral transition-colors">관리자</Link>
                )}
                <Link to="/inquiries" className="text-[11px] font-bold hover:text-ink transition-colors">1:1 문의</Link>
                <button onClick={() => navigate(accessToken ? '/mypage' : '/login')}>
                    <User className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-ink transition-colors"/>
                </button>
                <Link to="/wishlist" className="text-ink-soft hover:text-coral">
                    <Heart className="w-5 h-5 stroke-[1.5px] transition-colors" />
                </Link>
                <Link to="/cart" className="relative group text-ink-soft hover:text-ink">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5px] transition-colors" />
                    <span className="absolute -top-1 -right-1.5 bg-coral text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-surface">
            {cartCount}
          </span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
