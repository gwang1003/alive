import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import api from './api/axios';
import { Category } from './types/category';

const App: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 백엔드의 GET /api/categories 호출
                const response = await api.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('카테고리 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* 상단 헤더 */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* 로고 */}
                        <div className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
                            ALIVE KIDS
                        </div>

                        {/* 카테고리 메뉴 (PC) */}
                        <nav className="hidden md:flex space-x-8">
                            {loading ? (
                                <div className="w-40 h-6 bg-gray-100 animate-pulse rounded"></div>
                            ) : (
                                categories.map((category) => (
                                    <button
                                        key={category.categoryId}
                                        className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {category.name}
                                    </button>
                                ))
                            )}
                        </nav>

                        {/* 우측 아이콘 메뉴 */}
                        <div className="flex items-center space-x-5 text-gray-600">
                            <Search className="w-6 h-6 cursor-pointer hover:text-blue-600" />
                            <User className="w-6 h-6 cursor-pointer hover:text-blue-600" />
                            <div className="relative cursor-pointer hover:text-blue-600">
                                <ShoppingBag className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
                            </div>
                            <Menu className="md:hidden w-6 h-6" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 영역 (임시) */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
                    <h2 className="text-4xl font-bold mb-4 italic text-gray-800">New Arrival</h2>
                    <p className="text-gray-500">우리아이를 위한 특별한 선택, ALIVE KIDS에서 시작하세요.</p>
                </div>
            </main>
        </div>
    );
};

export default App;