package com.alive.domain.product.dto;

import com.alive.domain.product.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageResponse {

    private Long imageId;
    private String imageUrl;
    private Boolean isThumbnail;
    private Integer displayOrder;

    // Entity → DTO 변환
    public static ProductImageResponse fromEntity(ProductImage image) {
        return ProductImageResponse.builder()
                .imageId(image.getImageId())
                .imageUrl(image.getImageUrl())
                .isThumbnail(image.getIsThumbnail())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}