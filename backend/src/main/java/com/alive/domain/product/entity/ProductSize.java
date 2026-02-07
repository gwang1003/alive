package com.alive.domain.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_sizes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "size_id")
    private Long sizeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "size_name", nullable = false, length = 20)
    private String sizeName;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 비즈니스 메서드

    /**
     * 재고 수량 업데이트
     */
    public void updateStock(Integer quantity) {
        this.stockQuantity = quantity;
    }

    /**
     * 재고 감소 (주문 시)
     */
    public void decreaseStock(Integer quantity) {
        if (this.stockQuantity < quantity) {
            throw new IllegalStateException("재고가 부족합니다");
        }
        this.stockQuantity -= quantity;
    }

    /**
     * 재고 증가 (취소 시)
     */
    public void increaseStock(Integer quantity) {
        this.stockQuantity += quantity;
    }
}