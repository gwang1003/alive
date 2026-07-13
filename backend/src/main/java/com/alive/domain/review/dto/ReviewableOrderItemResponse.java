package com.alive.domain.review.dto;

import com.alive.domain.order.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
