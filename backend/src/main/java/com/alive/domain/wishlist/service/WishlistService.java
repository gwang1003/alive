package com.alive.domain.wishlist.service;

import com.alive.domain.product.entity.Product;
import com.alive.domain.product.repository.ProductRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import com.alive.domain.wishlist.dto.WishlistResponse;
import com.alive.domain.wishlist.entity.Wishlist;
import com.alive.domain.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 위시리스트 추가/삭제/조회 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * 상품을 위시리스트에 추가한다. 이미 추가된 상품이면 예외를 던진다.
     */
    @Transactional
    public WishlistResponse addWishlist(String email, Long productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        if (wishlistRepository.existsByUserUserIdAndProductProductId(user.getUserId(), productId)) {
            throw new RuntimeException("이미 위시리스트에 추가된 상품입니다");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        return WishlistResponse.fromEntity(wishlistRepository.save(wishlist));
    }

    /**
     * 위시리스트에서 상품을 제거한다.
     */
    @Transactional
    public void removeWishlist(String email, Long productId) {
        User user = getUser(email);
        Wishlist wishlist = wishlistRepository.findByUserUserIdAndProductProductId(user.getUserId(), productId)
                .orElseThrow(() -> new RuntimeException("위시리스트에서 찾을 수 없습니다"));
        wishlistRepository.delete(wishlist);
    }

    /**
     * 회원의 위시리스트 목록을 조회한다.
     */
    public List<WishlistResponse> getMyWishlist(String email) {
        User user = getUser(email);
        return wishlistRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(WishlistResponse::fromEntity)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
