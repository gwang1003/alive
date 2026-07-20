package com.alive.domain.review.dto;

import com.alive.domain.order.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 리뷰 작성 가능한 주문 항목 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewableOrderItemResponse {

    private Long orderItemId;
    private String productName;
    private String color;
    private String size;
    private LocalDateTime orderedAt;

    /**
     * OrderItem 엔티티를 응답 DTO로 변환
     */
    public static ReviewableOrderItemResponse fromEntity(OrderItem orderItem) {
        return ReviewableOrderItemResponse.builder()
                .orderItemId(orderItem.getOrderItemId())
                .productName(orderItem.getProductName())
                .color(orderItem.getColor())
                .size(orderItem.getSize())
                .orderedAt(orderItem.getOrder().getOrderedAt())
                .build();
    }
}
