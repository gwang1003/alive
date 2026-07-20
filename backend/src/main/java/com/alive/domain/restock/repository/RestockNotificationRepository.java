package com.alive.domain.restock.repository;

import com.alive.domain.restock.entity.RestockNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 재입고 알림 신청 JPA 리포지토리
 */
@Repository
public interface RestockNotificationRepository extends JpaRepository<RestockNotification, Long> {

    // 특정 회원이 특정 옵션에 신청한 재입고 알림을 조회
    Optional<RestockNotification> findByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    // 특정 회원이 특정 옵션에 이미 신청했는지 여부
    boolean existsByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    // 특정 옵션에 대해 아직 재입고 알림이 발송(표시)되지 않은 신청 목록을 조회 (재입고 시 ProductService에서 사용)
    List<RestockNotification> findByProductStockStockIdAndNotifiedFalse(Long stockId);

    // 특정 회원의 재입고 알림 신청 목록을 최신순으로 조회
    List<RestockNotification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
