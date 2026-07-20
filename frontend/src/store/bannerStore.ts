import { create } from 'zustand';
import api from '../api/axios';
import { Banner } from '../types/banner';

interface BannerState {
    banners: Banner[];
    adminBanners: Banner[];
    isLoading: boolean;
    fetchBanners: () => Promise<void>;
    fetchAdminBanners: () => Promise<void>;
    createBanner: (title: string, linkUrl: string, displayOrder: number, image: File) => Promise<void>;
    updateBanner: (bannerId: number, payload: Partial<{ title: string; linkUrl: string; displayOrder: number; isActive: boolean }>) => Promise<void>;
    deleteBanner: (bannerId: number) => Promise<void>;
}

// 배너 관리 스토어: 노출용 배너 목록과 관리자용 배너 CRUD를 담당
const useBannerStore = create<BannerState>((set, get) => ({
    banners: [],
    adminBanners: [],
    isLoading: false,

    fetchBanners: async () => {
        const response = await api.get<Banner[]>('/banners');
        set({ banners: response.data });
    },

    fetchAdminBanners: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<Banner[]>('/admin/banners');
            set({ adminBanners: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    // 이미지 파일을 포함해 FormData(multipart)로 배너 생성
    createBanner: async (title, linkUrl, displayOrder, image) => {
        const formData = new FormData();
        formData.append('title', title);
        if (linkUrl) formData.append('linkUrl', linkUrl);
        formData.append('displayOrder', String(displayOrder));
        formData.append('image', image);
        await api.post('/admin/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        await get().fetchAdminBanners();
    },

    updateBanner: async (bannerId, payload) => {
        await api.patch(`/admin/banners/${bannerId}`, payload);
        await get().fetchAdminBanners();
    },

    deleteBanner: async (bannerId) => {
        await api.delete(`/admin/banners/${bannerId}`);
        await get().fetchAdminBanners();
    },
}));

export default useBannerStore;
