package com.alive.domain.product.service;

import com.alive.domain.product.dto.*;
import com.alive.domain.product.entity.*;
import com.alive.domain.product.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductSizeRepository productSizeRepository;
    private final ProductImageRepository productImageRepository;

    // ========== 상품 조회 (일반 사용자) ==========

    /**
     * 상품 목록 조회 (페이징)
     */
    public Page<ProductListResponse> getProductList(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 상품 상세 조회
     */
    @Transactional
    public ProductDetailResponse getProductDetail(Long productId) {
        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // 조회수 증가
        product.increaseViewCount();

        return ProductDetailResponse.fromEntity(product);
    }

    /**
     * 카테고리별 상품 조회
     */
    public Page<ProductListResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryCategoryIdAndIsActiveTrue(
                categoryId,
                pageable
        );
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 복합 필터링 조회
     */
    public Page<ProductListResponse> getProductsByFilters(
            Long categoryId,
            Gender gender,
            Integer minAge,
            Integer maxAge,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Page<Product> products = productRepository.findByFilters(
                categoryId,
                gender,
                minAge,
                maxAge,
                minPrice,
                maxPrice,
                pageable
        );
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 키워드 검색
     */
    public Page<ProductListResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByKeyword(keyword, pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 인기 상품 조회 (조회수 기준)
     */
    public List<ProductListResponse> getPopularProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findPopularProducts(pageable);
        return products.stream()
                .map(ProductListResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 신상품 조회
     */
    public List<ProductListResponse> getNewProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findNewProducts(pageable);
        return products.stream()
                .map(ProductListResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 할인 상품 조회
     */
    public Page<ProductListResponse> getDiscountedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findDiscountedProducts(pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    // ========== 상품 관리 (관리자) ==========

    /**
     * 상품 등록
     */
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        // 카테고리 확인
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다"));

        // 상품 엔티티 생성
        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountRate(request.getDiscountRate())
                .gender(request.getGender())
                .minAge(request.getMinAge())
                .maxAge(request.getMaxAge())
                .material(request.getMaterial())
                .stockQuantity(0) // 초기값, 사이즈별 재고 합산 후 업데이트
                .isActive(true)
                .build();

        // 상품 저장
        Product savedProduct = productRepository.save(product);

        // 사이즈 등록
        int totalStock = 0;
        for (ProductCreateRequest.ProductSizeRequest sizeRequest : request.getSizes()) {
            ProductSize size = ProductSize.builder()
                    .product(savedProduct)
                    .sizeName(sizeRequest.getSizeName())
                    .stockQuantity(sizeRequest.getStockQuantity())
                    .build();

            productSizeRepository.save(size);
            totalStock += sizeRequest.getStockQuantity();
        }

        // 전체 재고 업데이트
        savedProduct.updateProduct(null, null, null, null, null);

        return ProductResponse.builder()
                .productId(savedProduct.getProductId())
                .name(savedProduct.getName())
                .price(savedProduct.getPrice())
                .discountRate(savedProduct.getDiscountRate())
                .finalPrice(savedProduct.getFinalPrice())
                .message("상품이 등록되었습니다")
                .build();
    }

    /**
     * 상품 수정
     */
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // 카테고리 변경 시
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다"));
            // category 필드가 없으므로 별도 처리 필요
        }

        // 상품 정보 업데이트
        product.updateProduct(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getDiscountRate(),
                request.getIsActive()
        );

        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .finalPrice(product.getFinalPrice())
                .message("상품이 수정되었습니다")
                .build();
    }

    /**
     * 상품 삭제 (soft delete - isActive = false)
     */
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // isActive를 false로 설정
        product.updateProduct(null, null, null, null, false);
    }

    /**
     * 상품 사이즈 재고 수정
     */
    @Transactional
    public ProductSizeResponse updateStock(Long productId, Long sizeId, StockUpdateRequest request) {
        ProductSize size = productSizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("사이즈를 찾을 수 없습니다"));

        // 상품 ID 일치 확인
        if (!size.getProduct().getProductId().equals(productId)) {
            throw new RuntimeException("해당 상품의 사이즈가 아닙니다");
        }

        // 재고 업데이트
        size.updateStock(request.getStockQuantity());

        // 전체 재고 다시 계산
        Integer totalStock = productSizeRepository.getTotalStockByProductId(productId);
        Product product = size.getProduct();
        // totalStock을 product에 반영하는 로직 필요

        return ProductSizeResponse.builder()
                .sizeId(size.getSizeId())
                .sizeName(size.getSizeName())
                .stockQuantity(size.getStockQuantity())
                .build();
    }

    /**
     * 특정 상품의 사이즈 목록 조회
     */
    public List<ProductSizeResponse> getProductSizes(Long productId) {
        List<ProductSize> sizes = productSizeRepository.findByProductProductId(productId);
        return sizes.stream()
                .map(ProductSizeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 상품의 이미지 목록 조회
     */
    public List<ProductImageResponse> getProductImages(Long productId) {
        List<ProductImage> images = productImageRepository
                .findByProductProductIdOrderByDisplayOrderAsc(productId);
        return images.stream()
                .map(ProductImageResponse::fromEntity)
                .collect(Collectors.toList());
    }
}