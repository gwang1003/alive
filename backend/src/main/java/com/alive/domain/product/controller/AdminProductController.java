package com.alive.domain.product.controller;

import com.alive.domain.product.dto.*;
import com.alive.domain.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    /**
     * 상품 등록 (멀티파트 + JSON)
     * POST /api/admin/products
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "thumbnails", required = false) List<MultipartFile> thumbnails,
            @RequestPart(value = "detailFiles", required = false) List<MultipartFile> detailFiles,
            @RequestPart(value = "productData") String productDataJson
    ) {
        try {
            // JSON 문자열을 DTO로 변환
            ProductCreateRequest request = objectMapper.readValue(
                    productDataJson,
                    ProductCreateRequest.class
            );

            ProductResponse response = productService.createProduct(
                    request,
                    mainImage,
                    thumbnails,
                    detailFiles
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            throw new RuntimeException("상품 등록 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 전체 상품 목록 조회 (비활성 상품 포함)
     * GET /api/admin/products?page&size
     */
    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> getProducts(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(productService.getAdminProductList(pageable));
    }

    /**
     * 상품 상세 조회 (비활성 상품 포함, 수정 폼 로딩용)
     * GET /api/admin/products/{productId}
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponse> getProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getAdminProductDetail(productId));
    }

    /**
     * 상품 수정 (활성/비활성 토글 포함)
     * PATCH /api/admin/products/{productId}
     */
    @PatchMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpdateRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    /**
     * 상품 삭제 (소프트 삭제)
     * DELETE /api/admin/products/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}