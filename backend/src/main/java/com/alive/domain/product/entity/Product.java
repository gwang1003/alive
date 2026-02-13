package com.alive.domain.product.entity;

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

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_rate")
    private Integer discountRate = 0;

    @Column(length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(length = 100)
    private String material;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관관계 매핑
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductSize> sizes = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    // 비즈니스 메서드

    /**
     * 최종 가격 계산 (할인 적용)
     */
    public BigDecimal getFinalPrice() {
        if (discountRate == null || discountRate == 0) {
            return price;
        }
        BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(discountRate))
                .divide(BigDecimal.valueOf(100));
        return price.subtract(discountAmount);
    }

    /**
     * 조회수 증가
     */
    public void increaseViewCount() {
        this.viewCount++;
    }

    /**
     * 상품 수정
     */
    public void updateProduct(String name, String description, BigDecimal price,
                              Integer discountRate, Boolean isActive) {
        if (name != null) this.name = name;
        if (description != null) this.description = description;
        if (price != null) this.price = price;
        if (discountRate != null) this.discountRate = discountRate;
        if (isActive != null) this.isActive = isActive;
    }

    public void updateStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}