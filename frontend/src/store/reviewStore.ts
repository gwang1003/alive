import { create } from 'zustand';
import api from '../api/axios';
import { PageResponse, Review, ReviewableOrderItem, ReviewCreateRequest, ReviewSummary } from '../types/review';

interface ReviewState {
    reviews: Review[];
    totalPages: number;
    currentPage: number;
    summary: ReviewSummary | null;
    reviewableItems: ReviewableOrderItem[];
    isLoading: boolean;
    fetchReviews: (productId: number, page: number, sort: string) => Promise<void>;
    fetchSummary: (productId: number) => Promise<void>;
    fetchReviewableItems: (productId: number) => Promise<void>;
    createReview: (request: ReviewCreateRequest) => Promise<Review>;
    uploadReviewImages: (reviewId: number, files: File[]) => Promise<Review>;
}

// 리뷰 스토어: 상품별 리뷰 목록/요약/작성가능 항목 조회 및 리뷰 작성·이미지 업로드를 담당
const useReviewStore = create<ReviewState>((set) => ({
    reviews: [],
    totalPages: 0,
    currentPage: 0,
    summary: null,
    reviewableItems: [],
    isLoading: false,

    fetchReviews: async (productId, page, sort) => {
        set({ isLoading: true });
        try {
            const response = await api.get<PageResponse<Review>>(`/reviews/products/${productId}`, {
                params: { page, sort },
            });
            set({
                reviews: response.data.content,
                totalPages: response.data.totalPages,
                currentPage: response.data.number,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSummary: async (productId) => {
        const response = await api.get<ReviewSummary>(`/reviews/products/${productId}/summary`);
        set({ summary: response.data });
    },

    // 로그인한 사용자가 해당 상품에 대해 리뷰 작성 가능한 주문 항목 목록 조회
    fetchReviewableItems: async (productId) => {
        const response = await api.get<ReviewableOrderItem[]>(`/reviews/products/${productId}/reviewable-items`);
        set({ reviewableItems: response.data });
    },

    createReview: async (request) => {
        const response = await api.post<Review>('/reviews', request);
        return response.data;
    },

    // 작성된 리뷰에 이미지 파일들을 FormData(multipart)로 추가 업로드
    uploadReviewImages: async (reviewId, files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        const response = await api.post<Review>(`/reviews/${reviewId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
}));

export default useReviewStore;
