package com.alive.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {

    @NotBlank(message = "받는 분 성함은 필수입니다")
    private String recipientName;

    @NotBlank(message = "연락처는 필수입니다")
    private String recipientPhone;

    @NotBlank(message = "배송지 주소는 필수입니다")
    private String deliveryAddress;

    private String deliveryMessage;

    // 지정하지 않으면(null) 장바구니 전체를 주문 처리 (하위 호환)
    private List<Long> cartItemIds;
}
