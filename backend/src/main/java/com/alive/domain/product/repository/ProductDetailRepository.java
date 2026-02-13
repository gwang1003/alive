package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {
    List<ProductDetail> findByProductProductIdOrderByDisplayOrderAsc(Long productId);
    void deleteByProductProductId(Long productId);
}