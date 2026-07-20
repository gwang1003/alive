package com.alive.domain.order.service;

import com.alive.domain.cart.entity.CartItem;
import com.alive.domain.cart.repository.CartItemRepository;
import com.alive.domain.order.dto.DirectOrderItemRequest;
import com.alive.domain.order.dto.OrderCreateRequest;
import com.alive.domain.order.dto.OrderResponse;
import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderItem;
import com.alive.domain.order.entity.OrderStatus;
import com.alive.domain.order.repository.OrderRepository;
import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.product.repository.ProductStockRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 주문 도메인 서비스. 주문 생성/조회/취소와 관리자용 주문 관리를 담당한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(50000);
    private static final BigDecimal DEFAULT_DELIVERY_FEE = BigDecimal.valueOf(3000);
    private static final DateTimeFormatter ORDER_NUMBER_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductStockRepository productStockRepository;
    private final UserRepository userRepository;

    /**
     * 주문을 생성한다. 바로 구매(directItem) 또는 장바구니 항목으로 주문 항목을 채우고,
     * 재고를 차감하며 5만원 미만이면 배송비를 부과한다.
     */
    @Transactional
    public OrderResponse createOrder(String email, OrderCreateRequest request) {
        User user = getUser(email);

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

        BigDecimal totalAmount = request.getDirectItem() != null
                ? addDirectItem(order, request.getDirectItem())
                : addCartItems(order, user, request.getCartItemIds());

        BigDecimal deliveryFee = totalAmount.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO
                : DEFAULT_DELIVERY_FEE;
        BigDecimal finalAmount = totalAmount.add(deliveryFee);

        order.updateAmounts(totalAmount, BigDecimal.ZERO, deliveryFee, finalAmount);

        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    // Buy Now: 장바구니를 전혀 건드리지 않고 지정된 옵션/수량만 바로 주문
    private BigDecimal addDirectItem(Order order, DirectOrderItemRequest directItem) {
        ProductStock stock = productStockRepository.findById(directItem.getStockId())
                .orElseThrow(() -> new RuntimeException("상품 옵션을 찾을 수 없습니다"));

        if (directItem.getQuantity() > stock.getQuantity()) {
            throw new RuntimeException("재고가 부족합니다: " + stock.getProduct().getName());
        }

        stock.updateQuantity(stock.getQuantity() - directItem.getQuantity());

        BigDecimal price = stock.getProduct().getPrice();
        BigDecimal unitPrice = stock.getProduct().getFinalPrice();
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(directItem.getQuantity()));

        order.addOrderItem(OrderItem.builder()
                .order(order)
                .product(stock.getProduct())
                .productStock(stock)
                .productName(stock.getProduct().getName())
                .color(stock.getColor())
                .size(stock.getSize())
                .sizeName(stock.getSize())
                .price(price)
                .unitPrice(unitPrice)
                .quantity(directItem.getQuantity())
                .subtotal(subtotal)
                .build());

        return subtotal;
    }

    // 장바구니 전체 또는 선택된 일부(cartItemIds)를 주문 처리
    private BigDecimal addCartItems(Order order, User user, List<Long> cartItemIds) {
        List<CartItem> cartItems = cartItemRepository.findByUserUserId(user.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("장바구니가 비어있습니다");
        }

        if (cartItemIds != null && !cartItemIds.isEmpty()) {
            cartItems = cartItems.stream()
                    .filter(item -> cartItemIds.contains(item.getCartItemId()))
                    .toList();

            if (cartItems.size() != cartItemIds.size()) {
                throw new RuntimeException("선택한 장바구니 항목을 찾을 수 없습니다");
            }
        }

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

            order.addOrderItem(OrderItem.builder()
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
                    .build());
        }

        cartItemRepository.deleteAll(cartItems);
        return totalAmount;
    }

    /**
     * 사용자의 주문 목록을 최신순으로 조회한다.
     */
    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserUserIdOrderByOrderedAtDesc(user.getUserId()).stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    /**
     * 본인 소유 주문의 상세 정보를 조회한다.
     */
    public OrderResponse getOrderDetail(String email, Long orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));
        return OrderResponse.fromEntity(order);
    }

    /**
     * (관리자용) 전체 주문을 상태 필터와 페이징으로 조회한다.
     */
    public Page<OrderResponse> getAdminOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders = status != null
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);
        return orders.map(OrderResponse::fromEntity);
    }

    /**
     * (관리자용) 소유자 제한 없이 주문 상세를 조회한다.
     */
    public OrderResponse getAdminOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));
        return OrderResponse.fromEntity(order);
    }

    /**
     * (관리자용) 단건 주문의 상태를 변경한다.
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));
        order.updateStatus(status);
        return OrderResponse.fromEntity(order);
    }

    /**
     * (관리자용) 여러 주문의 상태를 한 번에 변경한다. 존재하지 않는 주문이 섞여 있으면 예외를 던진다.
     */
    @Transactional
    public void updateOrderStatusBulk(List<Long> orderIds, OrderStatus status) {
        List<Order> orders = orderRepository.findAllById(orderIds);
        if (orders.size() != orderIds.size()) {
            throw new RuntimeException("주문을 찾을 수 없습니다");
        }
        orders.forEach(order -> order.updateStatus(status));
    }

    /**
     * 주문을 취소한다. PENDING/PAID 상태만 취소 가능하며, 취소 시 차감했던 재고를 복원한다.
     */
    @Transactional
    public OrderResponse cancelOrder(String email, Long orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("이미 취소된 주문입니다");
        }
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PAID) {
            throw new RuntimeException("배송이 시작된 주문은 취소할 수 없습니다");
        }

        for (OrderItem item : order.getOrderItems()) {
            ProductStock stock = item.getProductStock();
            stock.updateQuantity(stock.getQuantity() + item.getQuantity());
        }

        order.cancel();
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
