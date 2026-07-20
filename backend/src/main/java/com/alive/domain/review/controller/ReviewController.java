package com.alive.domain.review.controller;

import com.alive.domain.review.dto.ReviewCreateRequest;
import com.alive.domain.review.dto.ReviewResponse;
import com.alive.domain.review.dto.ReviewSummaryResponse;
import com.alive.domain.review.dto.ReviewableOrderItemResponse;
import com.alive.domain.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 상품 리뷰 API 컨트롤러 (조회/작성/사진 첨부)
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 상품별 리뷰 목록 조회 (페이징/정렬)
     * GET /api/reviews/products/{productId}
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    /**
     * 상품별 리뷰 요약(평균 별점, 별점 분포) 조회
     * GET /api/reviews/products/{productId}/summary
     */
    @GetMapping("/products/{productId}/summary")
    public ResponseEntity<ReviewSummaryResponse> getReviewSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewSummary(productId));
    }

    /**
     * 내가 이 상품에 대해 리뷰를 작성할 수 있는 주문 항목 목록
     * GET /api/reviews/products/{productId}/reviewable-items
     */
    @GetMapping("/products/{productId}/reviewable-items")
    public ResponseEntity<List<ReviewableOrderItemResponse>> getReviewableOrderItems(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewableOrderItems(currentEmail(), productId));
    }

    /**
     * 리뷰 작성
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        ReviewResponse response = reviewService.createReview(currentEmail(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 리뷰 사진 첨부 (본인 리뷰만, 최대 5장)
     * POST /api/reviews/{reviewId}/images
     */
    @PostMapping("/{reviewId}/images")
    public ResponseEntity<ReviewResponse> uploadReviewImages(
            @PathVariable Long reviewId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(reviewService.uploadReviewImages(currentEmail(), reviewId, files));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
