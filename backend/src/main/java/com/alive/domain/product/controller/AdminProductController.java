package com.alive.domain.product.controller;

import com.alive.domain.product.dto.*;
import com.alive.domain.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")  // 관리자만 접근 가능
public class AdminProductController {

    private final ProductService productService;

    /**
     * 상품 등록
     * POST /api/admin/products
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductCreateRequest request
    ) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 상품 수정
     * PUT /api/admin/products/{productId}
     */
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpdateRequest request
    ) {
        ProductResponse response = productService.updateProduct(productId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 상품 삭제
     * DELETE /api/admin/products/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "상품이 삭제되었습니다");
        response.put("productId", productId);

        return ResponseEntity.ok(response);
    }

    /**
     * 상품 사이즈 재고 수정
     * PATCH /api/admin/products/{productId}/sizes/{sizeId}/stock
     */
    @PatchMapping("/{productId}/sizes/{sizeId}/stock")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable Long productId,
            @PathVariable Long sizeId,
            @Valid @RequestBody StockUpdateRequest request
    ) {
        ProductSizeResponse sizeResponse = productService.updateStock(productId, sizeId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("sizeId", sizeResponse.getSizeId());
        response.put("sizeName", sizeResponse.getSizeName());
        response.put("stockQuantity", sizeResponse.getStockQuantity());
        response.put("message", "재고가 수정되었습니다");

        return ResponseEntity.ok(response);
    }

    /**
     * 특정 상품의 사이즈 목록 조회
     * GET /api/admin/products/{productId}/sizes
     */
    @GetMapping("/{productId}/sizes")
    public ResponseEntity<List<ProductSizeResponse>> getProductSizes(@PathVariable Long productId) {
        List<ProductSizeResponse> sizes = productService.getProductSizes(productId);
        return ResponseEntity.ok(sizes);
    }

    /**
     * 특정 상품의 이미지 목록 조회
     * GET /api/admin/products/{productId}/images
     */
    @GetMapping("/{productId}/images")
    public ResponseEntity<List<ProductImageResponse>> getProductImages(@PathVariable Long productId) {
        List<ProductImageResponse> images = productService.getProductImages(productId);
        return ResponseEntity.ok(images);
    }

    // TODO: 이미지 업로드 기능은 파일 처리 구현 후 추가 예정
    /**
     * 상품 이미지 업로드
     * POST /api/admin/products/{productId}/images
     */
    /*
    @PostMapping("/{productId}/images")
    public ResponseEntity<ProductImageResponse> uploadImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false, defaultValue = "false") Boolean isThumbnail,
            @RequestParam(required = false, defaultValue = "0") Integer displayOrder
    ) {
        // 파일 업로드 로직 구현 필요
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    */
}