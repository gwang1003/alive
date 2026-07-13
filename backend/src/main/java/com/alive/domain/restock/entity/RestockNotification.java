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

    public void markNotified() {
        this.notified = true;
    }
}
