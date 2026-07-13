package com.alive.domain.restock.dto;

import com.alive.domain.restock.entity.RestockNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestockNotificationResponse {

    private Long restockNotificationId;
    private Long stockId;
    private Boolean notified;

    public static RestockNotificationResponse fromEntity(RestockNotification entity) {
        return RestockNotificationResponse.builder()
                .restockNotificationId(entity.getRestockNotificationId())
                .stockId(entity.getProductStock().getStockId())
                .notified(entity.getNotified())
                .build();
    }
}
