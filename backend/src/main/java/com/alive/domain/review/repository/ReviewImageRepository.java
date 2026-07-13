package com.alive.domain.review.repository;

import com.alive.domain.review.entity.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {

    List<ReviewImage> findByReviewReviewIdOrderByCreatedAtAsc(Long reviewId);

    int countByReviewReviewId(Long reviewId);
}
