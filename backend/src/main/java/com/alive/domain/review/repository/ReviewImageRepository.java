package com.alive.domain.review.repository;

import com.alive.domain.review.entity.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 리뷰 이미지 리포지토리
 */
@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {

    /** 특정 리뷰의 이미지를 등록순으로 조회 */
    List<ReviewImage> findByReviewReviewIdOrderByCreatedAtAsc(Long reviewId);

    /** 특정 리뷰에 등록된 이미지 개수 조회 */
    int countByReviewReviewId(Long reviewId);
}
