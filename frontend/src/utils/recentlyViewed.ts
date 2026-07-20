const STORAGE_KEY = 'recentlyViewedProductIds';
const MAX_ITEMS = 10;

// 최근 본 상품 목록 맨 앞에 추가(중복 제거, 최대 개수 유지), localStorage에 저장
export function addRecentlyViewed(productId: number): void {
    const ids = getRecentlyViewedIds().filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
}

// localStorage에서 최근 본 상품 ID 목록을 읽어옴(파싱 실패 시 빈 배열)
export function getRecentlyViewedIds(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
