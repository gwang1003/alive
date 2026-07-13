package com.alive.domain.wishlist.repository;

import com.alive.domain.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserUserIdAndProductProductId(Long userId, Long productId);

    Optional<Wishlist> findByUserUserIdAndProductProductId(Long userId, Long productId);
}
