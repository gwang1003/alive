package com.alive.domain.order.repository;

import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 주문 리포지토리
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 사용자의 주문 목록을 최신순으로 조회
    List<Order> findByUserUserIdOrderByOrderedAtDesc(Long userId);

    // 본인 소유 주문만 조회 (권한 검증용)
    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);

    // 주문번호 + 본인 소유 여부로 주문 조회 (결제 검증 등에 사용)
    Optional<Order> findByOrderNumberAndUserUserId(String orderNumber, Long userId);

    // 관리자 화면에서 상태별 주문 목록을 페이지 단위로 조회
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
