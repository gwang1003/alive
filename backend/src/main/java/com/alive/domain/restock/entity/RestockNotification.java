package com.alive.domain.restock.entity;

import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 재입고 알림 신청 엔티티. 실제 이메일/푸시 발송은 하지 않으며, ProductService가 재고를
 * 0에서 양수로 되돌릴 때 notified 플래그를 true로 바꿔 인앱 알림함에 노출하는 방식이다.
 */
@Entity
@Table(name = "restock_notifications")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestockNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restock_notification_id")
    private Long restockNotificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id")
    private ProductStock productStock;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * 재입고 완료로 표시한다. 실제 알림 발송이 아닌 인앱 알림함 상태 갱신이다.
     */
    public void markNotified() {
        this.notified = true;
    }
}
