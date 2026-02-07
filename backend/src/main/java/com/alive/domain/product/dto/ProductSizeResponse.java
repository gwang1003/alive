package com.alive.domain.product.dto;

import com.alive.domain.product.entity.ProductSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSizeResponse {

    private Long sizeId;
    private String sizeName;
    private Integer stockQuantity;

    // Entity → DTO 변환
    public static ProductSizeResponse fromEntity(ProductSize size) {
        return ProductSizeResponse.builder()
                .sizeId(size.getSizeId())
                .sizeName(size.getSizeName())
                .stockQuantity(size.getStockQuantity())
                .build();
    }
}