package com.alive.domain.order.repository;

import com.alive.domain.order.entity.OrderItem;
import com.alive.domain.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Optional<OrderItem> findByOrderItemIdAndOrderUserUserId(Long orderItemId, Long userId);

    List<OrderItem> findByOrderUserUserIdAndOrderStatusAndProductProductId(Long userId, OrderStatus status, Long productId);
}
