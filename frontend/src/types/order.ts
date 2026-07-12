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

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

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

export interface OrderCreateRequest {
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
    deliveryMessage?: string;
}
