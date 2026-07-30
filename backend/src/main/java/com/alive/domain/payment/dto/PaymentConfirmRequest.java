package com.alive.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 토스페이먼츠 결제 승인 요청 DTO. 금액은 서버에서 주문 DB 값으로 검증하므로 클라이언트가 전송하지 않는다.
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
}
