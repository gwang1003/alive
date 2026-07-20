// 상품 리뷰
export interface Review {
    reviewId: number;
    userName: string;
    rating: number;
    content: string;
    color: string;
    size: string;
    createdAt: string;
    imageUrls: string[];
}

// 상품 리뷰 통계(평균 평점, 별점 분포)
export interface ReviewSummary {
    averageRating: number;
    totalCount: number;
    ratingCounts: Record<number, number>;
}

// 아직 리뷰를 작성하지 않은, 리뷰 작성 가능한 주문 항목
export interface ReviewableOrderItem {
    orderItemId: number;
    productName: string;
    color: string;
    size: string;
    orderedAt: string;
}

// 리뷰 작성 요청 payload
export interface ReviewCreateRequest {
    orderItemId: number;
    rating: number;
    content: string;
}

// 스프링 Page 응답 형태의 페이지네이션 래퍼
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
