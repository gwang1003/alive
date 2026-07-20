package com.alive.domain.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 상품 상세 설명 블록(텍스트/이미지) DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailBlockDto {
    String type;
    String value;
    int displayOrder;

}
