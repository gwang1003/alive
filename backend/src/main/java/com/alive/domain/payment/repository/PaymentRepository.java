package com.alive.domain.payment.repository;

import com.alive.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 결제 리포지토리
 */
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 주문 ID로 결제 정보 조회
    Optional<Payment> findByOrder_OrderId(Long orderId);
}
