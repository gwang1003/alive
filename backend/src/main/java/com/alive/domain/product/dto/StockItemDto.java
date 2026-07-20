package com.alive.domain.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 색상/사이즈 조합별 재고 항목 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockItemDto {

    String color;
    String size;
    int quantity;

}
