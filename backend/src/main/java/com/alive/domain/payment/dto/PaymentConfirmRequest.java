package com.alive.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * 토스페이먼츠 결제 승인 요청 DTO. amount는 서버에서 주문 금액과 대조 검증된다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmRequest {

    @NotBlank(message = "paymentKey는 필수입니다")
    private String paymentKey;

    @NotBlank(message = "orderId는 필수입니다")
    private String orderId;

    @NotNull(message = "결제 금액은 필수입니다")
    private BigDecimal amount;
}
