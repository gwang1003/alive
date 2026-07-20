package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ModelInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 상품 모델 착용 정보 리포지토리
 */
@Repository
public interface ModelInfoRepository extends JpaRepository<ModelInfo, Long> {
    // 상품 ID로 모델 정보 조회
    Optional<ModelInfo> findByProductProductId(Long productId);
}