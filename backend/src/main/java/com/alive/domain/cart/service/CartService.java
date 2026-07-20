package com.alive.domain.cart.service;

import com.alive.domain.cart.dto.CartItemAddRequest;
import com.alive.domain.cart.dto.CartItemResponse;
import com.alive.domain.cart.entity.CartItem;
import com.alive.domain.cart.repository.CartItemRepository;
import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.product.repository.ProductStockRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 장바구니 도메인 서비스. 조회/담기/수량 변경/삭제와 재고 검증을 담당한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductStockRepository productStockRepository;
    private final UserRepository userRepository;

    /**
     * 사용자의 장바구니 항목 전체를 조회한다.
     */
    public List<CartItemResponse> getCart(String email) {
        User user = getUser(email);
        return cartItemRepository.findByUserUserId(user.getUserId()).stream()
                .map(CartItemResponse::fromEntity)
                .toList();
    }

    /**
     * 장바구니에 상품을 담는다. 이미 담긴 옵션이면 수량을 합산하고, 재고 초과 시 예외를 던진다.
     */
    @Transactional
    public CartItemResponse addItem(String email, CartItemAddRequest request) {
        User user = getUser(email);
        ProductStock stock = productStockRepository.findById(request.getStockId())
                .orElseThrow(() -> new RuntimeException("재고 정보를 찾을 수 없습니다"));

        if (!stock.getProduct().getIsActive()) {
            throw new RuntimeException("판매 중지된 상품입니다");
        }

        CartItem cartItem = cartItemRepository
                .findByUserUserIdAndProductStockStockId(user.getUserId(), stock.getStockId())
                .orElse(null);

        int newQuantity = (cartItem != null ? cartItem.getQuantity() : 0) + request.getQuantity();
        if (newQuantity > stock.getQuantity()) {
            throw new RuntimeException("재고가 부족합니다");
        }

        if (cartItem != null) {
            cartItem.updateQuantity(newQuantity);
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .productStock(stock)
                    .quantity(newQuantity)
                    .build();
        }

        return CartItemResponse.fromEntity(cartItemRepository.save(cartItem));
    }

    /**
     * 장바구니 항목의 수량을 변경한다. 재고를 초과하면 예외를 던진다.
     */
    @Transactional
    public CartItemResponse updateQuantity(String email, Long cartItemId, int quantity) {
        CartItem cartItem = getOwnedCartItem(email, cartItemId);

        if (quantity > cartItem.getProductStock().getQuantity()) {
            throw new RuntimeException("재고가 부족합니다");
        }

        cartItem.updateQuantity(quantity);
        return CartItemResponse.fromEntity(cartItem);
    }

    /**
     * 장바구니 항목을 삭제한다.
     */
    @Transactional
    public void removeItem(String email, Long cartItemId) {
        CartItem cartItem = getOwnedCartItem(email, cartItemId);
        cartItemRepository.delete(cartItem);
    }

    private CartItem getOwnedCartItem(String email, Long cartItemId) {
        User user = getUser(email);
        return cartItemRepository.findByCartItemIdAndUserUserId(cartItemId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
