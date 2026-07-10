package com.alive.domain.cart.controller;

import com.alive.domain.cart.dto.CartItemAddRequest;
import com.alive.domain.cart.dto.CartItemResponse;
import com.alive.domain.cart.dto.CartItemUpdateRequest;
import com.alive.domain.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * 장바구니 조회
     * GET /api/cart
     */
    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        return ResponseEntity.ok(cartService.getCart(currentEmail()));
    }

    /**
     * 장바구니에 상품 담기
     * POST /api/cart/items
     */
    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addItem(@Valid @RequestBody CartItemAddRequest request) {
        CartItemResponse response = cartService.addItem(currentEmail(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 장바구니 항목 수량 변경
     * PATCH /api/cart/items/{cartItemId}
     */
    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateQuantity(
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartItemUpdateRequest request
    ) {
        CartItemResponse response = cartService.updateQuantity(currentEmail(), cartItemId, request.getQuantity());
        return ResponseEntity.ok(response);
    }

    /**
     * 장바구니 항목 삭제
     * DELETE /api/cart/items/{cartItemId}
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(currentEmail(), cartItemId);
        return ResponseEntity.noContent().build();
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
