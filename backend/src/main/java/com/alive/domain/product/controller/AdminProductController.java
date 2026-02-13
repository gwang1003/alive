package com.alive.domain.product.controller;

import com.alive.domain.product.dto.*;
import com.alive.domain.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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

    // ... 나머지 메서드들
}