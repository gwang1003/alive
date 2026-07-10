package com.alive.domain.cart.repository;

import com.alive.domain.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserUserId(Long userId);

    Optional<CartItem> findByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    Optional<CartItem> findByCartItemIdAndUserUserId(Long cartItemId, Long userId);
}
