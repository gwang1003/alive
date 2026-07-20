package com.alive.domain.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 리뷰 작성 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {

    @NotNull(message = "주문 항목은 필수입니다")
    private Long orderItemId;

    @NotNull(message = "별점은 필수입니다")
    @Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "별점은 5점 이하이어야 합니다")
    private Integer rating;

    @NotBlank(message = "리뷰 내용은 필수입니다")
    private String content;
}
