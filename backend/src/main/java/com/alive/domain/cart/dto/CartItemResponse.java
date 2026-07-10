package com.alive.domain.cart.dto;

import com.alive.domain.cart.entity.CartItem;
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
public class CartItemResponse {

    private Long cartItemId;
    private Long productId;
    private String productName;
    private String thumbnailUrl;
    private String color;
    private String size;
    private BigDecimal price;
    private Integer discountRate;
    private BigDecimal finalPrice;
    private Integer quantity;
    private Integer availableStock;

    public static CartItemResponse fromEntity(CartItem cartItem) {
        Product product = cartItem.getProductStock().getProduct();
        String thumbnailUrl = product.getImages().stream()
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(null);

        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .productId(product.getProductId())
                .productName(product.getName())
                .thumbnailUrl(thumbnailUrl)
                .color(cartItem.getProductStock().getColor())
                .size(cartItem.getProductStock().getSize())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .finalPrice(product.getFinalPrice())
                .quantity(cartItem.getQuantity())
                .availableStock(cartItem.getProductStock().getQuantity())
                .build();
    }
}
