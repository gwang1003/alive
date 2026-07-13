package com.alive.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryResponse {

    private double averageRating;
    private long totalCount;
    private Map<Integer, Long> ratingCounts;
}
