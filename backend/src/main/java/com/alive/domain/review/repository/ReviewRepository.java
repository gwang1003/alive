package com.alive.domain.review.repository;

import com.alive.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 리뷰 리포지토리
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** 상품별 리뷰를 페이지 단위로 조회 */
    Page<Review> findByProductProductId(Long productId, Pageable pageable);

    /** 상품별 리뷰 전체 조회 */
    List<Review> findByProductProductId(Long productId);

    /** 해당 주문 항목에 대한 리뷰 작성 여부 확인 */
    boolean existsByOrderItemOrderItemId(Long orderItemId);
}
