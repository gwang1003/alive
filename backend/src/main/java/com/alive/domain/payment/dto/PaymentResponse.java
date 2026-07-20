package com.alive.domain.payment.dto;

import com.alive.domain.payment.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 결제 승인 결과 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long orderId;
    private String orderNumber;
    private String method;
    private BigDecimal amount;
    private String receiptUrl;
    private LocalDateTime approvedAt;

    /**
     * Payment 엔티티를 응답 DTO로 변환한다.
     */
    public static PaymentResponse fromEntity(Payment payment) {
        return PaymentResponse.builder()
                .orderId(payment.getOrder().getOrderId())
                .orderNumber(payment.getOrder().getOrderNumber())
                .method(payment.getMethod())
                .amount(payment.getAmount())
                .receiptUrl(payment.getReceiptUrl())
                .approvedAt(payment.getApprovedAt())
                .build();
    }
}
