// 장바구니 담긴 상품 옵션 항목
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
