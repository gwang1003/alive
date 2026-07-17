package com.alive.domain.restock.repository;

import com.alive.domain.restock.entity.RestockNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestockNotificationRepository extends JpaRepository<RestockNotification, Long> {

    Optional<RestockNotification> findByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    boolean existsByUserUserIdAndProductStockStockId(Long userId, Long stockId);

    List<RestockNotification> findByProductStockStockIdAndNotifiedFalse(Long stockId);

    List<RestockNotification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
