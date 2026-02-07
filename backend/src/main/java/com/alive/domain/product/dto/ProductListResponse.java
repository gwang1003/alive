package com.alive.domain.product.dto;

import com.alive.domain.product.entity.Gender;
import com.alive.domain.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListResponse {

    private Long productId;
    private String name;
    private BigDecimal price;
    private Integer discountRate;
    private BigDecimal finalPrice;
    private String thumbnailImage;
    private Gender gender;
    private Integer minAge;
    private Integer maxAge;
    private Integer stockQuantity;
    private Integer viewCount;
    private String categoryName;

    // Entity → DTO 변환 (목록용 - 간단한 정보만)
    public static ProductListResponse fromEntity(Product product) {
        // 썸네일 이미지 찾기
        String thumbnail = product.getImages().stream()
                .filter(img -> img.getIsThumbnail() != null && img.getIsThumbnail())
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(null);

        return ProductListResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .finalPrice(product.getFinalPrice())
                .thumbnailImage(thumbnail)
                .gender(product.getGender())
                .minAge(product.getMinAge())
                .maxAge(product.getMaxAge())
                .stockQuantity(product.getStockQuantity())
                .viewCount(product.getViewCount())
                .categoryName(product.getCategory() != null ?
                        product.getCategory().getName() : null)
                .build();
    }
}