package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {

    // 특정 상품의 모든 사이즈 조회
    List<ProductSize> findByProductProductId(Long productId);

    // 특정 상품의 특정 사이즈 조회
    Optional<ProductSize> findByProductProductIdAndSizeName(Long productId, String sizeName);

    // 재고가 있는 사이즈만 조회
    @Query("SELECT ps FROM ProductSize ps WHERE ps.product.productId = :productId " +
            "AND ps.stockQuantity > 0")
    List<ProductSize> findAvailableSizesByProductId(@Param("productId") Long productId);

    // 특정 상품의 전체 재고 수량 합계
    @Query("SELECT SUM(ps.stockQuantity) FROM ProductSize ps " +
            "WHERE ps.product.productId = :productId")
    Integer getTotalStockByProductId(@Param("productId") Long productId);
}