package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 상품 옵션별 재고 리포지토리
 */
@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
    // 특정 상품의 재고 목록 조회
    List<ProductStock> findByProductProductId(Long productId);
    // 특정 상품의 재고 전체 삭제
    void deleteByProductProductId(Long productId);
}