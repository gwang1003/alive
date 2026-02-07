package com.alive.domain.product.service;

import com.alive.domain.product.dto.CategoryResponse;
import com.alive.domain.product.entity.Category;
import com.alive.domain.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * 전체 카테고리 조회 (표시 순서대로)
     */
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 최상위 카테고리 조회
     */
    public List<CategoryResponse> getTopCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 하위 카테고리 조회
     */
    public List<CategoryResponse> getSubCategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId).stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 ID로 조회
     */
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다"));

        return CategoryResponse.fromEntity(category);
    }
}