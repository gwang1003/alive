package com.alive.domain.product.controller;

import com.alive.domain.product.dto.ProductDetailResponse;
import com.alive.domain.product.dto.ProductListResponse;
import com.alive.domain.product.entity.Gender;
import com.alive.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * 상품 목록 조회 (페이징, 필터링)
     * GET /api/products
     *
     * Query Parameters:
     * - page: 페이지 번호 (기본값: 0)
     * - size: 페이지 크기 (기본값: 20)
     * - sort: 정렬 기준 (예: createdAt,desc)
     * - categoryId: 카테고리 ID
     * - gender: 성별 (MALE, FEMALE, UNISEX)
     * - minAge: 최소 연령 (개월)
     * - maxAge: 최대 연령 (개월)
     * - minPrice: 최소 가격
     * - maxPrice: 최대 가격
     * - keyword: 검색 키워드
     */
    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword
    ) {
        // 정렬 파라미터 파싱
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        Page<ProductListResponse> products;

        // 키워드 검색
        if (keyword != null && !keyword.isEmpty()) {
            products = productService.searchProducts(keyword, pageable);
        }
        // 필터링 조회
        else if (categoryId != null || gender != null || minAge != null ||
                maxAge != null || minPrice != null || maxPrice != null) {
            products = productService.getProductsByFilters(
                    categoryId, gender, minAge, maxAge, minPrice, maxPrice, pageable
            );
        }
        // 전체 목록 조회
        else {
            products = productService.getProductList(pageable);
        }

        return ResponseEntity.ok(products);
    }

    /**
     * 상품 상세 조회
     * GET /api/products/{productId}
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Long productId) {
        ProductDetailResponse product = productService.getProductDetail(productId);
        return ResponseEntity.ok(product);
    }

    /**
     * 카테고리별 상품 조회
     * GET /api/products/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductListResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        Page<ProductListResponse> products = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * 인기 상품 조회 (조회수 기준)
     * GET /api/products/popular?limit=10
     */
    @GetMapping("/popular")
    public ResponseEntity<List<ProductListResponse>> getPopularProducts(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ProductListResponse> products = productService.getPopularProducts(limit);
        return ResponseEntity.ok(products);
    }

    /**
     * 신상품 조회
     * GET /api/products/new?limit=10
     */
    @GetMapping("/new")
    public ResponseEntity<List<ProductListResponse>> getNewProducts(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ProductListResponse> products = productService.getNewProducts(limit);
        return ResponseEntity.ok(products);
    }

    /**
     * 할인 상품 조회
     * GET /api/products/discounted
     */
    @GetMapping("/discounted")
    public ResponseEntity<Page<ProductListResponse>> getDiscountedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListResponse> products = productService.getDiscountedProducts(pageable);
        return ResponseEntity.ok(products);
    }
}