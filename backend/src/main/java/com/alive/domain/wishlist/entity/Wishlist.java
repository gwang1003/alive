package com.alive.domain.wishlist.entity;

import com.alive.domain.product.entity.Product;
import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 위시리스트(찜) 엔티티. 회원-상품 조합은 유니크 제약으로 중복 등록을 막는다.
 */
@Entity
@Table(name = "wishlists", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Long wishlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
