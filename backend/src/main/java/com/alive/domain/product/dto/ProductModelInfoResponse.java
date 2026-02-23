package com.alive.domain.product.dto;

import com.alive.domain.product.entity.ModelInfo;
import com.alive.domain.product.entity.ProductImage;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductModelInfoResponse {

    private String modelName;
    private Integer height;
    private Integer weight;
    private String wearingColor;
    private Integer wearingSize;

    // Entity → DTO 변환
    public static ProductModelInfoResponse fromEntity(ModelInfo modelInfo) {
        return ProductModelInfoResponse.builder()
                .modelName(modelInfo.getModelName())
                .height(modelInfo.getHeight())
                .weight(modelInfo.getWeight())
                .wearingColor(modelInfo.getWearingColor())
                .wearingSize(modelInfo.getWearingSize())
                .build();
    }
}