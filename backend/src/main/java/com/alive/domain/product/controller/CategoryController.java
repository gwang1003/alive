package com.alive.domain.product.controller;

import com.alive.domain.product.dto.CategoryResponse;
import com.alive.domain.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 전체 카테고리 조회
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * 최상위 카테고리 조회
     * GET /api/categories/top
     */
    @GetMapping("/top")
    public ResponseEntity<List<CategoryResponse>> getTopCategories() {
        List<CategoryResponse> categories = categoryService.getTopCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * 하위 카테고리 조회
     * GET /api/categories/{parentId}/sub
     */
    @GetMapping("/{parentId}/sub")
    public ResponseEntity<List<CategoryResponse>> getSubCategories(@PathVariable Long parentId) {
        List<CategoryResponse> categories = categoryService.getSubCategories(parentId);
        return ResponseEntity.ok(categories);
    }

    /**
     * 카테고리 상세 조회
     * GET /api/categories/{categoryId}
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long categoryId) {
        CategoryResponse category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }
}