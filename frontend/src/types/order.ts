// 주문에 포함된 상품 옵션 항목
export interface OrderItem {
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    color: string;
    size: string;
    price: number;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

// 주문 처리 상태
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

// 주문 정보
export interface Order {
    orderId: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    discountAmount: number;
    deliveryFee: number;
    finalAmount: number;
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
    deliveryMessage: string | null;
    orderedAt: string;
    items: OrderItem[];
}

// 장바구니를 거치지 않는 바로구매 대상 항목
export interface DirectOrderItem {
    stockId: number;
    quantity: number;
}

// 주문 생성 요청 payload (장바구니 주문 또는 바로구매 중 하나를 채워 전달)
export interface OrderCreateRequest {
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
    deliveryMessage?: string;
    cartItemIds?: number[];
    directItem?: DirectOrderItem;
}
