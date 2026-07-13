package com.alive.domain.review.dto;

import com.alive.domain.review.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long reviewId;
    private String userName;
    private Integer rating;
    private String content;
    private String color;
    private String size;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userName(maskName(review.getUser().getName()))
                .rating(review.getRating())
                .content(review.getContent())
                .color(review.getOrderItem().getColor())
                .size(review.getOrderItem().getSize())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private static String maskName(String name) {
        if (name == null || name.isEmpty()) {
            return "익명";
        }
        return name.charAt(0) + "**";
    }
}
