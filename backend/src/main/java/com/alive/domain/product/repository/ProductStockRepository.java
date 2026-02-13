package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
    List<ProductStock> findByProductProductId(Long productId);
    void deleteByProductProductId(Long productId);
}