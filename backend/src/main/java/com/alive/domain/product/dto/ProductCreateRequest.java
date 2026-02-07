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

    @NotNull(message = "카테고리는 필수입니다")
    private Long categoryId;

    @NotBlank(message = "상품명은 필수입니다")
    @Size(min = 2, max = 200, message = "상품명은 2자 이상 200자 이하여야 합니다")
    private String name;

    @NotBlank(message = "상품 설명은 필수입니다")
    private String description;

    @NotNull(message = "가격은 필수입니다")
    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    private BigDecimal price;

    @Min(value = 0, message = "할인율은 0 이상이어야 합니다")
    @Max(value = 100, message = "할인율은 100 이하여야 합니다")
    private Integer discountRate = 0;

    private Gender gender;

    @Min(value = 0, message = "최소 연령은 0 이상이어야 합니다")
    private Integer minAge;

    @Min(value = 0, message = "최대 연령은 0 이상이어야 합니다")
    private Integer maxAge;

    private String material;

    @NotEmpty(message = "최소 1개 이상의 사이즈가 필요합니다")
    private List<ProductSizeRequest> sizes;

    // 내부 클래스: 사이즈 정보
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductSizeRequest {

        @NotBlank(message = "사이즈명은 필수입니다")
        private String sizeName;

        @NotNull(message = "재고 수량은 필수입니다")
        @Min(value = 0, message = "재고는 0 이상이어야 합니다")
        private Integer stockQuantity;
    }
}