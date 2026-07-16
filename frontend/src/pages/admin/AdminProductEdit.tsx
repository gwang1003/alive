import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminStore, { AdminProductStock } from '../../store/adminStore';

const AdminProductEdit: React.FC = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { fetchProductDetail, updateProduct, updateStock } = useAdminStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountRate, setDiscountRate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [stocks, setStocks] = useState<AdminProductStock[]>([]);
    const [stockDrafts, setStockDrafts] = useState<Record<number, string>>({});
    const [savingStockId, setSavingStockId] = useState<number | null>(null);
    const [savedStockId, setSavedStockId] = useState<number | null>(null);
    const [stockError, setStockError] = useState('');

    useEffect(() => {
        const load = async () => {
            const detail = await fetchProductDetail(Number(productId));
            setName(detail.name);
            setDescription(detail.description);
            setPrice(String(detail.price));
            setDiscountRate(String(detail.discountRate));
            setIsActive(detail.isActive);
            setStocks(detail.sizes);
            setStockDrafts(Object.fromEntries(detail.sizes.map((s) => [s.stockId, String(s.quantity)])));
            setIsLoading(false);
        };
        load();
    }, [productId]);

    const handleSubmit = async () => {
        setError('');
        try {
            await updateProduct(Number(productId), {
                name,
                description,
                price: Number(price),
                discountRate: Number(discountRate),
                isActive,
            });
            navigate('/admin/products');
        } catch (err: any) {
            setError(err.response?.data?.message ?? '상품 수정에 실패했습니다');
        }
    };

    const handleStockSave = async (stockId: number) => {
        setStockError('');
        setSavedStockId(null);
        const draft = stockDrafts[stockId];
        const quantity = Number(draft);
        if (draft === '' || Number.isNaN(quantity) || quantity < 0) {
            setStockError('재고 수량은 0 이상의 숫자여야 합니다');
            return;
        }
        setSavingStockId(stockId);
        try {
            const updated = await updateStock(Number(productId), stockId, quantity);
            setStocks((prev) => prev.map((s) => (s.stockId === stockId ? updated : s)));
            setSavedStockId(stockId);
        } catch (err: any) {
            setStockError(err.response?.data?.message ?? '재고 수정에 실패했습니다');
        } finally {
            setSavingStockId(null);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-canvas px-12 py-16 text-sm text-ink-soft">불러오는 중...</div>;
    }

    return (
        <div className="min-h-screen bg-canvas px-12 py-16">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-8">상품 수정</h1>

                <div className="space-y-1">
                    <label className="text-[11px] font-black text-ink-soft uppercase tracking-widest">상품명</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral bg-transparent"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-black text-ink-soft uppercase tracking-widest">설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-line p-4 text-sm outline-none focus:border-coral"
                    />
                </div>

                <div className="flex gap-6">
                    <div className="space-y-1 flex-1">
                        <label className="text-[11px] font-black text-ink-soft uppercase tracking-widest">가격</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral bg-transparent"
                        />
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-[11px] font-black text-ink-soft uppercase tracking-widest">할인율(%)</label>
                        <input
                            type="number"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(e.target.value)}
                            className="w-full border-b-2 border-line py-3 text-sm font-bold outline-none focus:border-coral bg-transparent"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-3">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    <span className="text-sm font-bold text-ink-soft">활성 상태 (판매 노출)</span>
                </label>

                {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                {stocks.length > 0 && (
                    <div className="pt-6 border-t border-line space-y-3">
                        <label className="text-[11px] font-black text-ink-soft uppercase tracking-widest">옵션별 재고</label>
                        <div className="border border-line rounded-2xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-line/30 text-ink-soft font-bold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="py-3 px-4 text-left">색상</th>
                                        <th className="py-3 px-4 text-left">사이즈</th>
                                        <th className="py-3 px-4 text-left w-32">재고 수량</th>
                                        <th className="py-3 px-4 w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {stocks.map((stock) => (
                                        <tr key={stock.stockId}>
                                            <td className="py-3 px-4 font-bold text-ink">{stock.color}</td>
                                            <td className="py-3 px-4 text-ink-soft">{stock.size}</td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={stockDrafts[stock.stockId] ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setStockDrafts((prev) => ({ ...prev, [stock.stockId]: value }));
                                                        setSavedStockId((prev) => (prev === stock.stockId ? null : prev));
                                                    }}
                                                    className="w-24 border-b-2 border-line py-1 text-sm font-bold outline-none focus:border-coral bg-transparent"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {savedStockId === stock.stockId ? (
                                                    <span className="text-[11px] font-bold text-sage">저장됨</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStockSave(stock.stockId)}
                                                        disabled={savingStockId === stock.stockId || Number(stockDrafts[stock.stockId]) === stock.quantity}
                                                        className="text-[11px] font-bold text-coral-deep hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                                                    >
                                                        {savingStockId === stock.stockId ? '저장 중...' : '저장'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {stockError && <p className="text-xs font-bold text-red-500">{stockError}</p>}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-3 text-xs font-black text-ink-soft uppercase tracking-widest"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-coral text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-coral-deep transition-all"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductEdit;
