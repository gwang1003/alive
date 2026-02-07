package com.alive.domain.product.dto;

import com.alive.domain.product.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long categoryId;
    private String name;
    private Long parentId;
    private Integer displayOrder;

    // Entity → DTO 변환
    public static CategoryResponse fromEntity(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .parentId(category.getParent() != null ?
                        category.getParent().getCategoryId() : null)
                .displayOrder(category.getDisplayOrder())
                .build();
    }
}