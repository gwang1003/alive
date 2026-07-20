package com.alive.domain.payment.entity;

/**
 * 결제 상태 (승인완료 / 취소 / 실패)
 */
public enum PaymentStatus {
    DONE,
    CANCELED,
    FAILED
}
