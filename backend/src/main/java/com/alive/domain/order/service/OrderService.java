package com.alive.domain.order.service;

import com.alive.domain.cart.entity.CartItem;
import com.alive.domain.cart.repository.CartItemRepository;
import com.alive.domain.order.dto.OrderCreateRequest;
import com.alive.domain.order.dto.OrderResponse;
import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderItem;
import com.alive.domain.order.entity.OrderStatus;
import com.alive.domain.order.repository.OrderRepository;
import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(50000);
    private static final BigDecimal DEFAULT_DELIVERY_FEE = BigDecimal.valueOf(3000);
    private static final DateTimeFormatter ORDER_NUMBER_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(String email, OrderCreateRequest request) {
        User user = getUser(email);
        List<CartItem> cartItems = cartItemRepository.findByUserUserId(user.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("장바구니가 비어있습니다");
        }

        Order order = Order.builder()
                .user(user)
                .orderNumber(generateOrderNumber())
                .status(OrderStatus.PENDING)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryMessage(request.getDeliveryMessage())
                .totalAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            ProductStock stock = cartItem.getProductStock();

            if (cartItem.getQuantity() > stock.getQuantity()) {
                throw new RuntimeException("재고가 부족합니다: " + stock.getProduct().getName());
            }

            stock.updateQuantity(stock.getQuantity() - cartItem.getQuantity());

            BigDecimal price = stock.getProduct().getPrice();
            BigDecimal unitPrice = stock.getProduct().getFinalPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(stock.getProduct())
                    .productStock(stock)
                    .productName(stock.getProduct().getName())
                    .color(stock.getColor())
                    .size(stock.getSize())
                    .sizeName(stock.getSize())
                    .price(price)
                    .unitPrice(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build();

            order.addOrderItem(orderItem);
        }

        BigDecimal deliveryFee = totalAmount.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO
                : DEFAULT_DELIVERY_FEE;
        BigDecimal finalAmount = totalAmount.add(deliveryFee);

        order.updateAmounts(totalAmount, BigDecimal.ZERO, deliveryFee, finalAmount);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return OrderResponse.fromEntity(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserUserIdOrderByOrderedAtDesc(user.getUserId()).stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    public OrderResponse getOrderDetail(String email, Long orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));
        return OrderResponse.fromEntity(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(ORDER_NUMBER_FORMAT);
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "ORD" + timestamp + random;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
