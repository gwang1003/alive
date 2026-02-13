package com.alive.domain.product.dto;

import com.alive.domain.product.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {

    @NotBlank(message = "상품명은 필수입니다")
    @Size(min = 2, max = 200, message = "상품명은 2자 이상 200자 이하여야 합니다")
    private String name;

    @NotBlank(message = "메인 설명은 필수입니다")
    private String mainDescription;

    @NotNull(message = "가격은 필수입니다")
    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    private BigDecimal price;

    @NotNull(message = "카테고리는 필수입니다")
    private Long categoryId;

    @NotNull(message = "성별은 필수입니다")
    private Gender gender;

    @NotNull(message = "모델 정보는 필수입니다")
    private ModelInfoDto modelInfo;

    @NotNull(message = "옵션은 필수입니다")
    private ProductOptionDto options;

    @NotEmpty(message = "재고 정보는 필수입니다")
    private List<StockItemDto> stocks;

    @NotEmpty(message = "상세 블록은 필수입니다")
    private List<DetailBlockDto> detailBlocks;

    // ========== 내부 DTO 클래스 ==========

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelInfoDto {
        @NotBlank(message = "모델명은 필수입니다")
        private String modelName;

        @Min(value = 0, message = "키는 0 이상이어야 합니다")
        private Integer height;

        @Min(value = 0, message = "몸무게는 0 이상이어야 합니다")
        private Integer weight;

        @NotBlank(message = "착용 컬러는 필수입니다")
        private String wearingColor;

        @Min(value = 0, message = "착용 사이즈는 0 이상이어야 합니다")
        private Integer wearingSize;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductOptionDto {
        @NotEmpty(message = "색상 옵션은 필수입니다")
        private List<String> colors;

        @NotEmpty(message = "사이즈 옵션은 필수입니다")
        private List<String> sizes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockItemDto {
        @NotBlank(message = "색상은 필수입니다")
        private String color;

        @NotBlank(message = "사이즈는 필수입니다")
        private String size;

        @Min(value = 0, message = "수량은 0 이상이어야 합니다")
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailBlockDto {
        @NotBlank(message = "블록 타입은 필수입니다")
        private String type; // "IMAGE" or "TEXT"

        private String value; // TEXT일 때 내용

        @NotNull(message = "표시 순서는 필수입니다")
        private Integer displayOrder;
    }
}