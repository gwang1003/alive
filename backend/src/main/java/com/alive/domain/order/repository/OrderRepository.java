package com.alive.domain.order.repository;

import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUserIdOrderByOrderedAtDesc(Long userId);

    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
