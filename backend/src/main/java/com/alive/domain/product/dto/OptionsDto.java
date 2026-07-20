package com.alive.domain.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 상품 옵션(색상/사이즈) DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OptionsDto {

    @NotNull(message = "최소 한 개 이상의 컬러가 있어야합니다.")
    String[] colors;

    @NotNull(message = "최소 한 개 이상의 사이즈가 있어야 합니다.")
    int sizes;

}
