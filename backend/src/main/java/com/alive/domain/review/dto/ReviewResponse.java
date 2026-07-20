package com.alive.domain.review.dto;

import com.alive.domain.review.entity.Review;
import com.alive.domain.review.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 리뷰 조회 응답 DTO
 */
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

    /**
     * Review 엔티티를 응답 DTO로 변환.
     * orderItem은 seed 데이터이거나 주문 항목이 이후 삭제된 경우 null일 수 있어 null 체크 후 매핑한다.
     */
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

    /**
     * 작성자 이름을 마스킹 처리 (첫 글자만 노출)
     */
    private static String maskName(String name) {
        if (name == null || name.isEmpty()) {
            return "익명";
        }
        return name.charAt(0) + "**";
    }
}
