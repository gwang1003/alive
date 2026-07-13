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
}

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

    fetchReviewableItems: async (productId) => {
        const response = await api.get<ReviewableOrderItem[]>(`/reviews/products/${productId}/reviewable-items`);
        set({ reviewableItems: response.data });
    },

    createReview: async (request) => {
        const response = await api.post<Review>('/reviews', request);
        return response.data;
    },
}));

export default useReviewStore;
