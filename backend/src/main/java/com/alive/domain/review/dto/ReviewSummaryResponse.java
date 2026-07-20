package com.alive.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 상품 리뷰 요약 응답 DTO (평균 별점, 총 개수, 별점별 개수)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryResponse {

    private double averageRating;
    private long totalCount;
    private Map<Integer, Long> ratingCounts;
}
