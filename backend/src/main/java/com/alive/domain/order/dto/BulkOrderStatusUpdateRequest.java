package com.alive.domain.order.dto;

import com.alive.domain.order.entity.OrderStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 주문 상태 일괄 변경 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkOrderStatusUpdateRequest {

    @NotEmpty(message = "주문을 1개 이상 선택해주세요")
    private List<Long> orderIds;

    @NotNull(message = "주문 상태는 필수입니다")
    private OrderStatus status;
}
