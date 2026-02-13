package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ModelInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModelInfoRepository extends JpaRepository<ModelInfo, Long> {
    Optional<ModelInfo> findByProductProductId(Long productId);
}