package com.alive.domain.cart.entity;

import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 장바구니 항목 엔티티. 사용자-재고(옵션) 조합은 유니크 제약으로 중복 담기를 방지한다.
 */
@Entity
@Table(name = "cart_items", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "stock_id"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private ProductStock productStock;

    @Column(nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 장바구니 항목 수량을 변경한다.
     */
    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
