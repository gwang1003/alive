export interface WishlistItem {
    wishlistId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    price: number;
    finalPrice: number;
    discountRate: number | null;
}
