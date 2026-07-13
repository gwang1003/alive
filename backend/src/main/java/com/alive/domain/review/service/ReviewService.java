package com.alive.domain.review.service;

import com.alive.common.service.FileStorageService;
import com.alive.domain.order.entity.OrderItem;
import com.alive.domain.order.entity.OrderStatus;
import com.alive.domain.order.repository.OrderItemRepository;
import com.alive.domain.review.dto.ReviewCreateRequest;
import com.alive.domain.review.dto.ReviewResponse;
import com.alive.domain.review.dto.ReviewSummaryResponse;
import com.alive.domain.review.dto.ReviewableOrderItemResponse;
import com.alive.domain.review.entity.Review;
import com.alive.domain.review.entity.ReviewImage;
import com.alive.domain.review.repository.ReviewImageRepository;
import com.alive.domain.review.repository.ReviewRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private static final int MAX_REVIEW_IMAGES = 5;

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ReviewResponse createReview(String email, ReviewCreateRequest request) {
        User user = getUser(email);
        OrderItem orderItem = orderItemRepository.findByOrderItemIdAndOrderUserUserId(request.getOrderItemId(), user.getUserId())
                .orElseThrow(() -> new RuntimeException("주문 항목을 찾을 수 없습니다"));

        if (orderItem.getOrder().getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("배송 완료된 상품만 리뷰를 작성할 수 있습니다");
        }
        if (reviewRepository.existsByOrderItemOrderItemId(orderItem.getOrderItemId())) {
            throw new RuntimeException("이미 리뷰를 작성한 상품입니다");
        }

        Review review = Review.builder()
                .product(orderItem.getProduct())
                .user(user)
                .orderItem(orderItem)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductProductId(productId, pageable)
                .map(ReviewResponse::fromEntity);
    }

    public ReviewSummaryResponse getReviewSummary(Long productId) {
        List<Review> reviews = reviewRepository.findByProductProductId(productId);

        long totalCount = reviews.size();
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        Map<Integer, Long> ratingCounts = reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));

        return ReviewSummaryResponse.builder()
                .averageRating(averageRating)
                .totalCount(totalCount)
                .ratingCounts(ratingCounts)
                .build();
    }

    @Transactional
    public ReviewResponse uploadReviewImages(String email, Long reviewId, List<MultipartFile> files) {
        User user = getUser(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다"));

        if (!review.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("본인이 작성한 리뷰만 사진을 추가할 수 있습니다");
        }

        int existingCount = reviewImageRepository.countByReviewReviewId(reviewId);
        if (existingCount + files.size() > MAX_REVIEW_IMAGES) {
            throw new RuntimeException("리뷰 사진은 최대 " + MAX_REVIEW_IMAGES + "장까지 등록할 수 있습니다");
        }

        for (MultipartFile file : files) {
            String imageUrl = fileStorageService.storeFile(file, "reviews");
            reviewImageRepository.save(ReviewImage.builder()
                    .review(review)
                    .imageUrl(imageUrl)
                    .build());
        }

        return ReviewResponse.fromEntity(review);
    }

    public List<ReviewableOrderItemResponse> getReviewableOrderItems(String email, Long productId) {
        User user = getUser(email);
        return orderItemRepository.findByOrderUserUserIdAndOrderStatusAndProductProductId(user.getUserId(), OrderStatus.DELIVERED, productId).stream()
                .filter(orderItem -> !reviewRepository.existsByOrderItemOrderItemId(orderItem.getOrderItemId()))
                .map(ReviewableOrderItemResponse::fromEntity)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
