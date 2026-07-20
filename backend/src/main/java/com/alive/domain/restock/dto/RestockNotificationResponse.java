package com.alive.domain.restock.dto;

import com.alive.domain.product.entity.ProductImage;
import com.alive.domain.restock.entity.RestockNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 재입고 알림 응답 DTO. notified는 실제 발송 여부가 아니라 재입고 완료로 표시되었는지를 나타낸다.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestockNotificationResponse {

    private Long restockNotificationId;
    private Long stockId;
    private Boolean notified;
    private Long productId;
    private String productName;
    private String thumbnailUrl;
    private String color;
    private String size;
    private LocalDateTime createdAt;

    /**
     * RestockNotification 엔티티를 응답 DTO로 변환한다. 상품 대표 이미지를 함께 채운다.
     */
    public static RestockNotificationResponse fromEntity(RestockNotification entity) {
        var stock = entity.getProductStock();
        var product = stock.getProduct();
        String thumbnailUrl = product.getImages().stream()
                .filter(ProductImage::getIsThumbnail)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElseGet(() -> product.getImages().stream().map(ProductImage::getImageUrl).findFirst().orElse(null));

        return RestockNotificationResponse.builder()
                .restockNotificationId(entity.getRestockNotificationId())
                .stockId(stock.getStockId())
                .notified(entity.getNotified())
                .productId(product.getProductId())
                .productName(product.getName())
                .thumbnailUrl(thumbnailUrl)
                .color(stock.getColor())
                .size(stock.getSize())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
