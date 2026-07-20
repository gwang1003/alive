package com.alive.domain.order.entity;

/**
 * 주문 상태 (대기 → 결제완료 → 배송중 → 배송완료, 또는 취소)
 */
public enum OrderStatus {
    PENDING,
    PAID,
    SHIPPING,
    DELIVERED,
    CANCELLED
}
