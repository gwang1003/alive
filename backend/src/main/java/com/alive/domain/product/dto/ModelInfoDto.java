package com.alive.domain.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 상품 모델 착용 정보(키/몸무게/착용 사이즈 등) DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ModelInfoDto {

    @NotNull(message = "모델명 필수입니다")
    String modelName;

    @NotNull(message = "모델 키는 필수입니다")
    int height;

    @NotNull(message = "모델 몸무게는 필수입니다")
    int weight;

    @NotNull(message = "착용한 상품 색상은 필수입니다")
    String wearingColor;

    @NotNull(message = "착용한 상품 사이즈는 필수입니다")
    int wearingSize;

}
