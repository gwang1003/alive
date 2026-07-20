package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 상품 상세 설명 블록 리포지토리
 */
@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {
    // 특정 상품의 상세 블록 조회 (표시 순서대로)
    List<ProductDetail> findByProductProductIdOrderByDisplayOrderAsc(Long productId);
    // 특정 상품의 상세 블록 전체 삭제
    void deleteByProductProductId(Long productId);
}