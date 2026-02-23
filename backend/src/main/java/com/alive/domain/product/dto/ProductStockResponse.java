package com.alive.domain.product.dto;

import com.alive.domain.product.entity.ProductStock;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStockResponse {

    private Long stockId;
    private String color;
    private String size;
    private Integer quantity;

    // Entity → DTO 변환
    public static ProductStockResponse fromEntity(ProductStock stock) {
        return ProductStockResponse.builder()
                .stockId(stock.getStockId())
                .color(stock.getColor())
                .size(stock.getSize())
                .quantity(stock.getQuantity())
                .build();
    }
}