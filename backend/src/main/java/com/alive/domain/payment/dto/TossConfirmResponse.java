package com.alive.domain.payment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 토스페이먼츠 결제 승인(confirm) API 응답을 매핑하는 DTO. 필요한 필드만 매핑하고 나머지는 무시한다.
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TossConfirmResponse {

    private String paymentKey;
    private String orderId;
    private String method;
    private String approvedAt;
    private Receipt receipt;

    /**
     * 결제 영수증 정보
     */
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Receipt {
        private String url;
    }
}
