import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag } from 'lucide-react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const categories = [
        { name: 'NEW', path: '/new' },
        { name: 'BEST', path: '/best' },
        { name: 'TOP', path: '/tops' },
        { name: 'BOTTOM', path: '/bottoms' },
        { name: 'SETS', path: '/sets' },
        { name: 'OUTER', path: '/outer' },
        { name: 'SALE', path: '/sale', isPoint: true },
    ];

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

            {/* 오른쪽: 유틸리티 아이콘 */}
            <div className="flex items-center gap-6 text-gray-400">
                <Search className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-gray-900 transition-colors" />
                <User className="w-5 h-5 stroke-[1.5px] cursor-pointer hover:text-gray-900 transition-colors" />
                <Link to="/cart" className="relative group text-gray-400 hover:text-gray-900">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5px] transition-colors" />
                    <span className="absolute -top-1 -right-1.5 bg-gray-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
            0
          </span>
                </Link>
            </div>
        </header>
    );
};

export default Header;