package com.alive.domain.product.dto;

import com.alive.domain.product.entity.Gender;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {

    private Long categoryId;

    @Size(min = 2, max = 200, message = "상품명은 2자 이상 200자 이하여야 합니다")
    private String name;

    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    private BigDecimal price;

    @Min(value = 0, message = "할인율은 0 이상이어야 합니다")
    @Max(value = 100, message = "할인율은 100 이하여야 합니다")
    private Integer discountRate;

    private Gender gender;

    @Min(value = 0, message = "최소 연령은 0 이상이어야 합니다")
    private Integer minAge;

    @Min(value = 0, message = "최대 연령은 0 이상이어야 합니다")
    private Integer maxAge;

    private String material;

    private Boolean isActive;
}