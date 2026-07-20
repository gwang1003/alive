package com.alive.domain.order.repository;

import com.alive.domain.order.entity.OrderItem;
import com.alive.domain.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 주문 항목 리포지토리
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 본인 소유 주문의 특정 주문 항목 조회 (권한 검증용)
    Optional<OrderItem> findByOrderItemIdAndOrderUserUserId(Long orderItemId, Long userId);

    // 사용자가 특정 상품을 특정 상태로 주문한 항목 조회 (예: 리뷰 작성 자격 확인용)
    List<OrderItem> findByOrderUserUserIdAndOrderStatusAndProductProductId(Long userId, OrderStatus status, Long productId);
}
