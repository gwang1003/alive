package com.alive.domain.wishlist.dto;

import com.alive.domain.wishlist.entity.Wishlist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 위시리스트 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private String thumbnailUrl;
    private BigDecimal price;
    private BigDecimal finalPrice;
    private Integer discountRate;

    /**
     * Wishlist 엔티티를 응답 DTO로 변환한다.
     */
    public static WishlistResponse fromEntity(Wishlist wishlist) {
        var product = wishlist.getProduct();
        String thumbnailUrl = product.getImages().stream()
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(null);

        return WishlistResponse.builder()
                .wishlistId(wishlist.getWishlistId())
                .productId(product.getProductId())
                .productName(product.getName())
                .thumbnailUrl(thumbnailUrl)
                .price(product.getPrice())
                .finalPrice(product.getFinalPrice())
                .discountRate(product.getDiscountRate())
                .build();
    }
}
