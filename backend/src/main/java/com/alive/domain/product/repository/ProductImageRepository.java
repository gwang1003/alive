package com.alive.domain.product.repository;

import com.alive.domain.product.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    // 특정 상품의 모든 이미지 조회 (표시 순서대로)
    List<ProductImage> findByProductProductIdOrderByDisplayOrderAsc(Long productId);

    // 특정 상품의 썸네일 이미지 조회
    Optional<ProductImage> findByProductProductIdAndIsThumbnailTrue(Long productId);

    // 특정 상품의 이미지 개수
    Long countByProductProductId(Long productId);

    // 특정 상품의 썸네일 여부 확인
    @Query("SELECT CASE WHEN COUNT(pi) > 0 THEN true ELSE false END " +
            "FROM ProductImage pi WHERE pi.product.productId = :productId " +
            "AND pi.isThumbnail = true")
    boolean existsThumbnailByProductId(@Param("productId") Long productId);
}