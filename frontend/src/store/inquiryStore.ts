import { create } from 'zustand';
import api from '../api/axios';
import { Inquiry, InquiryCreateRequest, InquiryStatus } from '../types/inquiry';
import { PageResponse } from '../types/product';

interface InquiryState {
    inquiries: Inquiry[];
    adminInquiries: Inquiry[];
    adminTotalPages: number;
    adminPage: number;
    isLoading: boolean;
    fetchInquiries: () => Promise<void>;
    createInquiry: (request: InquiryCreateRequest) => Promise<Inquiry>;
    fetchAdminInquiries: (page: number, status?: InquiryStatus) => Promise<void>;
    answerInquiry: (inquiryId: number, answer: string) => Promise<void>;
}

const useInquiryStore = create<InquiryState>((set, get) => ({
    inquiries: [],
    adminInquiries: [],
    adminTotalPages: 0,
    adminPage: 0,
    isLoading: false,

    fetchInquiries: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<Inquiry[]>('/inquiries');
            set({ inquiries: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    createInquiry: async (request) => {
        const response = await api.post<Inquiry>('/inquiries', request);
        await get().fetchInquiries();
        return response.data;
    },

    fetchAdminInquiries: async (page, status) => {
        set({ isLoading: true });
        try {
            const response = await api.get<PageResponse<Inquiry>>('/admin/inquiries', {
                params: { page, size: 20, status },
            });
            set({ adminInquiries: response.data.content, adminTotalPages: response.data.totalPages, adminPage: response.data.number });
        } finally {
            set({ isLoading: false });
        }
    },

    answerInquiry: async (inquiryId, answer) => {
        await api.patch(`/admin/inquiries/${inquiryId}/answer`, { answer });
        await get().fetchAdminInquiries(get().adminPage);
    },
}));

export default useInquiryStore;
