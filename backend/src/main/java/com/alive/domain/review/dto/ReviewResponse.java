package com.alive.domain.review.dto;

import com.alive.domain.review.entity.Review;
import com.alive.domain.review.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
    private List<String> imageUrls;

    public static ReviewResponse fromEntity(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userName(maskName(review.getUser().getName()))
                .rating(review.getRating())
                .content(review.getContent())
                .color(review.getOrderItem() != null ? review.getOrderItem().getColor() : null)
                .size(review.getOrderItem() != null ? review.getOrderItem().getSize() : null)
                .createdAt(review.getCreatedAt())
                .imageUrls(review.getImages().stream().map(ReviewImage::getImageUrl).toList())
                .build();
    }

    private static String maskName(String name) {
        if (name == null || name.isEmpty()) {
            return "익명";
        }
        return name.charAt(0) + "**";
    }
}
