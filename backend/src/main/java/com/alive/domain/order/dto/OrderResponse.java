package com.alive.domain.order.dto;

import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 주문 응답 DTO (주문 정보 + 주문 항목 목록)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;
    private String orderNumber;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal deliveryFee;
    private BigDecimal finalAmount;
    private String recipientName;
    private String recipientPhone;
    private String deliveryAddress;
    private String deliveryMessage;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> items;

    /**
     * Order 엔티티를 주문 항목 목록까지 포함해 응답 DTO로 변환한다.
     */
    public static OrderResponse fromEntity(Order order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .deliveryFee(order.getDeliveryFee())
                .finalAmount(order.getFinalAmount())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryMessage(order.getDeliveryMessage())
                .orderedAt(order.getOrderedAt())
                .items(order.getOrderItems().stream()
                        .map(OrderItemResponse::fromEntity)
                        .toList())
                .build();
    }
}
