package com.alive.domain.product.dto;

import com.alive.domain.product.entity.Gender;
import com.alive.domain.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponse {

    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer discountRate;
    private BigDecimal finalPrice;
    private Gender gender;
    private Integer minAge;
    private Integer maxAge;
    private String material;
    private Integer stockQuantity;
    private Integer viewCount;
    private Boolean isActive;
    private Long categoryId;
    private String categoryName;
    private List<ProductImageResponse> images;
    private List<ProductStockResponse> sizes;
    private ProductModelInfoResponse modelInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Entity → DTO 변환 (상세용 - 모든 정보)
    public static ProductDetailResponse fromEntity(Product product) {
        // 이미지 목록 변환
        List<ProductImageResponse> images = product.getImages().stream()
                .map(ProductImageResponse::fromEntity)
                .collect(Collectors.toList());

        // 사이즈 목록 변환
        List<ProductStockResponse> sizes = product.getStocks().stream()
                .map(ProductStockResponse::fromEntity)
                .collect(Collectors.toList());

        ProductModelInfoResponse modelInfo = ProductModelInfoResponse.fromEntity(product.getModelInfo());

        return ProductDetailResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .finalPrice(product.getFinalPrice())
                .gender(product.getGender())
                .minAge(product.getMinAge())
                .maxAge(product.getMaxAge())
                .material(product.getMaterial())
                .stockQuantity(product.getStockQuantity())
                .viewCount(product.getViewCount())
                .isActive(product.getIsActive())
                .categoryId(product.getCategory() != null ?
                        product.getCategory().getCategoryId() : null)
                .categoryName(product.getCategory() != null ?
                        product.getCategory().getName() : null)
                .images(images)
                .sizes(sizes)
                .modelInfo(modelInfo)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}