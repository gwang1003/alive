package com.alive.domain.wishlist.repository;

import com.alive.domain.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 위시리스트 JPA 리포지토리
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // 특정 회원의 위시리스트를 최신순으로 조회
    List<Wishlist> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    // 특정 회원이 특정 상품을 이미 찜했는지 여부
    boolean existsByUserUserIdAndProductProductId(Long userId, Long productId);

    // 특정 회원의 특정 상품에 대한 위시리스트 항목을 조회
    Optional<Wishlist> findByUserUserIdAndProductProductId(Long userId, Long productId);
}
