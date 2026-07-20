package com.alive.domain.order.entity;

import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 주문 엔티티. 배송/결제 정보와 주문 항목(OrderItem) 목록을 가진다.
 */
@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryFee = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalAmount;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "recipient_name", nullable = false, length = 50)
    private String recipientName;

    @Column(name = "recipient_phone", nullable = false, length = 20)
    private String recipientPhone;

    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    @Column(name = "delivery_message", columnDefinition = "TEXT")
    private String deliveryMessage;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod;

    @CreationTimestamp
    @Column(name = "ordered_at", nullable = false, updatable = false)
    private LocalDateTime orderedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    /**
     * 주문 상태를 취소로 변경한다.
     */
    public void cancel() {
        this.status = OrderStatus.CANCELLED;
    }

    /**
     * 주문 상태를 변경한다.
     */
    public void updateStatus(OrderStatus status) {
        this.status = status;
    }

    /**
     * 주문 항목을 추가한다.
     */
    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
    }

    /**
     * 주문 금액(합계/할인/배송비/최종금액)을 갱신한다.
     */
    public void updateAmounts(BigDecimal totalAmount, BigDecimal discountAmount, BigDecimal deliveryFee, BigDecimal finalAmount) {
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.deliveryFee = deliveryFee;
        this.finalAmount = finalAmount;
    }
}
