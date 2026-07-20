// 찜(위시리스트)한 상품 항목
export interface WishlistItem {
    wishlistId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    price: number;
    finalPrice: number;
    discountRate: number | null;
}
