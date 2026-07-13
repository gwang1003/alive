import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';

const AdminProductList: React.FC = () => {
    const navigate = useNavigate();
    const { products, productTotalPages, productPage, isLoading, fetchProducts, updateProduct, deleteProduct } = useAdminStore();

    useEffect(() => {
        fetchProducts(0);
    }, []);

    const handleToggleActive = async (productId: number, currentActive: boolean) => {
        await updateProduct(productId, { isActive: !currentActive });
    };

    const handleDelete = async (productId: number) => {
        if (!window.confirm('이 상품을 삭제(비활성화)하시겠습니까?')) return;
        await deleteProduct(productId);
    };

    return (
        <div className="min-h-screen bg-white px-12 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-black tracking-tighter">상품 관리</h1>
                    <button
                        onClick={() => navigate('/admin/products/new')}
                        className="px-6 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                    >
                        상품 등록
                    </button>
                </div>

                {isLoading && products.length === 0 && <p className="text-sm text-gray-400">불러오는 중...</p>}

                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="py-4 px-4 text-left">상품명</th>
                            <th className="py-4 px-4">가격</th>
                            <th className="py-4 px-4">재고</th>
                            <th className="py-4 px-4">카테고리</th>
                            <th className="py-4 px-4">상태</th>
                            <th className="py-4 px-4">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-50">
                                <td className="py-4 px-4 font-bold text-gray-900">{product.name}</td>
                                <td className="py-4 px-4 text-center">{product.price.toLocaleString()}원</td>
                                <td className="py-4 px-4 text-center">{product.stockQuantity}</td>
                                <td className="py-4 px-4 text-center text-gray-500">{product.categoryName ?? '-'}</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleToggleActive(product.productId, product.isActive)}
                                        className={`text-[10px] font-black px-3 py-1 rounded-full border transition-colors ${
                                            product.isActive
                                                ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
                                                : 'text-gray-400 border-gray-200 bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        {product.isActive ? '활성' : '비활성'}
                                    </button>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/products/${product.productId}/edit`)}
                                            className="text-[11px] font-bold text-blue-600 hover:underline"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.productId)}
                                            className="text-[11px] font-bold text-red-500 hover:underline"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productTotalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: productTotalPages }, (_, n) => n).map((n) => (
                            <button
                                key={n}
                                onClick={() => fetchProducts(n)}
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full ${n === productPage ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {n + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
