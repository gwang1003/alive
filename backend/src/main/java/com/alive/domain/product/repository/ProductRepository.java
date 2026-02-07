package com.alive.domain.product.repository;

import com.alive.domain.product.entity.Gender;
import com.alive.domain.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ========== 기본 조회 ==========

    // 활성화된 상품만 조회 (페이징)
    Page<Product> findByIsActiveTrue(Pageable pageable);

    // 상품 ID로 활성화된 상품 조회
    Optional<Product> findByProductIdAndIsActiveTrue(Long productId);

    // ========== 카테고리별 조회 ==========

    // 카테고리별 상품 조회
    Page<Product> findByCategoryCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    // ========== 필터링 조회 ==========

    // 성별로 필터링
    Page<Product> findByGenderAndIsActiveTrue(Gender gender, Pageable pageable);

    // 연령대로 필터링 (minAge <= 입력값 <= maxAge)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "AND p.minAge <= :age AND p.maxAge >= :age")
    Page<Product> findByAgeRange(@Param("age") Integer age, Pageable pageable);

    // 가격 범위로 필터링
    Page<Product> findByPriceBetweenAndIsActiveTrue(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );

    // ========== 복합 필터링 ==========

    // 카테고리 + 성별 + 연령 + 가격 범위 (복합 조건)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "AND (:categoryId IS NULL OR p.category.categoryId = :categoryId) " +
            "AND (:gender IS NULL OR p.gender = :gender) " +
            "AND (:minAge IS NULL OR p.minAge <= :minAge) " +
            "AND (:maxAge IS NULL OR p.maxAge >= :maxAge) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findByFilters(
            @Param("categoryId") Long categoryId,
            @Param("gender") Gender gender,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // ========== 검색 ==========

    // 상품명 또는 설명에서 키워드 검색
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "AND (p.name LIKE %:keyword% OR p.description LIKE %:keyword%)")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // ========== 특별 목록 조회 ==========

    // 인기 상품 (조회수 높은 순)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "ORDER BY p.viewCount DESC")
    List<Product> findPopularProducts(Pageable pageable);

    // 신상품 (최근 등록 순)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "ORDER BY p.createdAt DESC")
    List<Product> findNewProducts(Pageable pageable);

    // 할인 상품 (할인율 있는 상품)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "AND p.discountRate > 0 " +
            "ORDER BY p.discountRate DESC")
    Page<Product> findDiscountedProducts(Pageable pageable);

    // ========== 통계 ==========

    // 카테고리별 상품 개수
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.categoryId = :categoryId " +
            "AND p.isActive = true")
    Long countByCategoryId(@Param("categoryId") Long categoryId);

    // 전체 활성화된 상품 개수
    Long countByIsActiveTrue();
}