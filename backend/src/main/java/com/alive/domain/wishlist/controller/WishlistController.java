package com.alive.domain.wishlist.controller;

import com.alive.domain.wishlist.dto.WishlistResponse;
import com.alive.domain.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * 내 위시리스트 조회
     * GET /api/wishlist
     */
    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getMyWishlist() {
        return ResponseEntity.ok(wishlistService.getMyWishlist(currentEmail()));
    }

    /**
     * 위시리스트 추가
     * POST /api/wishlist/{productId}
     */
    @PostMapping("/{productId}")
    public ResponseEntity<WishlistResponse> addWishlist(@PathVariable Long productId) {
        WishlistResponse response = wishlistService.addWishlist(currentEmail(), productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 위시리스트 삭제
     * DELETE /api/wishlist/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeWishlist(@PathVariable Long productId) {
        wishlistService.removeWishlist(currentEmail(), productId);
        return ResponseEntity.noContent().build();
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
