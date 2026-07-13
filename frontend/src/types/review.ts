export interface Review {
    reviewId: number;
    userName: string;
    rating: number;
    content: string;
    color: string;
    size: string;
    createdAt: string;
}

export interface ReviewSummary {
    averageRating: number;
    totalCount: number;
    ratingCounts: Record<number, number>;
}

export interface ReviewableOrderItem {
    orderItemId: number;
    productName: string;
    color: string;
    size: string;
    orderedAt: string;
}

export interface ReviewCreateRequest {
    orderItemId: number;
    rating: number;
    content: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
