export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    color: string;
    size: string;
    price: number;
    discountRate: number | null;
    finalPrice: number;
    quantity: number;
    availableStock: number;
}
