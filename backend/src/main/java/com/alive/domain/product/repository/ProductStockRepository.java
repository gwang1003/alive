package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductStock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 상품 옵션별 재고 리포지토리
 */
@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
    // 특정 상품의 재고 목록 조회
    List<ProductStock> findByProductProductId(Long productId);
    // 특정 상품의 재고 전체 삭제
    void deleteByProductProductId(Long productId);

    /**
     * 비관적 쓰기 락(SELECT ... FOR UPDATE)으로 재고 행을 조회한다.
     * 주문 확정/취소처럼 재고를 읽고 바로 변경하는 트랜잭션에서 사용해,
     * 동시 주문 시 Lost Update(초과 판매·재고 음수)를 막는다.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ProductStock s WHERE s.stockId = :stockId")
    Optional<ProductStock> findByIdForUpdate(@Param("stockId") Long stockId);
}