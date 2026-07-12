package com.alive.domain.order.dto;

import com.alive.domain.order.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long productId;
    private String productName;
    private String thumbnailUrl;
    private String color;
    private String size;
    private BigDecimal price;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public static OrderItemResponse fromEntity(OrderItem item) {
        String thumbnailUrl = item.getProduct() != null
                ? item.getProduct().getImages().stream()
                    .findFirst()
                    .map(img -> img.getImageUrl())
                    .orElse(null)
                : null;

        return OrderItemResponse.builder()
                .productId(item.getProduct() != null ? item.getProduct().getProductId() : null)
                .productName(item.getProductName())
                .thumbnailUrl(thumbnailUrl)
                .color(item.getColor())
                .size(item.getSize())
                .price(item.getPrice())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
