package com.alive.domain.cart.repository;

import com.alive.domain.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 장바구니 항목 리포지토리
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // 사용자의 전체 장바구니 항목 조회
    List<CartItem> findByUserUserId(Long userId);

    // 사용자가 특정 재고(옵션)를 이미 담았는지 조회 (중복 담기 병합용)
    Optional<CartItem> findByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    // 본인 소유 장바구니 항목만 조회 (수량 변경/삭제 시 권한 검증용)
    Optional<CartItem> findByCartItemIdAndUserUserId(Long cartItemId, Long userId);
}
