import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRestockStore from '../store/restockStore';
import useAuthStore from '../assets/authStore';

const resolveImageSrc = (img: string | null) => (img ? `/api${img}` : null);

// 로그인 회원이 신청한 품절 상품 재입고 알림 목록을 보여주고 취소할 수 있는 페이지
const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const authChecked = useAuthStore((state) => state.authChecked);
    const { notifications, fetchMyNotifications, cancelNotification } = useRestockStore();

    // authChecked를 기다린 뒤 로그인 여부 확인하고 알림 목록을 불러온다
    useEffect(() => {
        if (!authChecked) return;
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchMyNotifications();
    }, [authChecked, accessToken]);

    if (!authChecked || !accessToken) {
        return null;
    }

    const handleDismiss = async (stockId: number) => {
        try {
            await cancelNotification(stockId);
        } catch (err: any) {
            alert(err.response?.data?.message ?? '삭제에 실패했습니다');
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-6 py-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-2">재입고 알림함</h1>
                <p className="text-sm text-ink-soft mb-12">품절 상품에 신청한 재입고 알림을 모아봅니다.</p>

                {notifications.length === 0 && (
                    <p className="text-ink-soft text-center py-32">신청한 재입고 알림이 없습니다.</p>
                )}

                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.restockNotificationId}
                            className="border border-line rounded-2xl p-6 flex items-center gap-4"
                        >
                            <div
                                className="w-16 h-20 rounded-xl bg-canvas overflow-hidden flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/product/detail/${n.productId}`)}
                            >
                                {resolveImageSrc(n.thumbnailUrl) && (
                                    <img
                                        src={resolveImageSrc(n.thumbnailUrl)!}
                                        alt={n.productName}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => navigate(`/product/detail/${n.productId}`)}
                            >
                                <p className="text-sm font-black text-ink">{n.productName}</p>
                                <p className="text-xs text-ink-soft mt-1">{n.color} / {n.size}</p>
                                {n.notified ? (
                                    <p className="text-[11px] font-black text-sage mt-2 uppercase tracking-widest">재입고 완료</p>
                                ) : (
                                    <p className="text-[11px] font-bold text-ink-soft mt-2">재입고 대기 중</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleDismiss(n.stockId)}
                                className="text-[11px] font-bold text-ink-soft hover:text-coral-deep"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
