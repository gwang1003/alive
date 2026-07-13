import { create } from 'zustand';
import api from '../api/axios';
import { PageResponse, ProductListItem } from '../types/product';
import { Order, OrderStatus } from '../types/order';

interface ProductUpdatePayload {
    name?: string;
    description?: string;
    price?: number;
    discountRate?: number;
    categoryId?: number;
    isActive?: boolean;
}

export interface AdminProductDetail {
    productId: number;
    name: string;
    description: string;
    price: number;
    discountRate: number;
    isActive: boolean;
    categoryId: number | null;
    categoryName: string | null;
}

interface AdminState {
    products: ProductListItem[];
    productTotalPages: number;
    productPage: number;
    orders: Order[];
    orderTotalPages: number;
    orderPage: number;
    isLoading: boolean;
    fetchProducts: (page: number) => Promise<void>;
    fetchProductDetail: (productId: number) => Promise<AdminProductDetail>;
    updateProduct: (productId: number, payload: ProductUpdatePayload) => Promise<void>;
    deleteProduct: (productId: number) => Promise<void>;
    fetchOrders: (page: number, status?: OrderStatus) => Promise<void>;
    fetchOrderDetail: (orderId: number) => Promise<Order>;
    updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

const useAdminStore = create<AdminState>((set, get) => ({
    products: [],
    productTotalPages: 0,
    productPage: 0,
    orders: [],
    orderTotalPages: 0,
    orderPage: 0,
    isLoading: false,

    fetchProducts: async (page) => {
        set({ isLoading: true });
        try {
            const response = await api.get<PageResponse<ProductListItem>>('/admin/products', {
                params: { page, size: 20 },
            });
            set({ products: response.data.content, productTotalPages: response.data.totalPages, productPage: response.data.number });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProductDetail: async (productId) => {
        const response = await api.get<AdminProductDetail>(`/admin/products/${productId}`);
        return response.data;
    },

    updateProduct: async (productId, payload) => {
        await api.patch(`/admin/products/${productId}`, payload);
        await get().fetchProducts(get().productPage);
    },

    deleteProduct: async (productId) => {
        await api.delete(`/admin/products/${productId}`);
        await get().fetchProducts(get().productPage);
    },

    fetchOrders: async (page, status) => {
        set({ isLoading: true });
        try {
            const response = await api.get<PageResponse<Order>>('/admin/orders', {
                params: { page, size: 20, status },
            });
            set({ orders: response.data.content, orderTotalPages: response.data.totalPages, orderPage: response.data.number });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrderDetail: async (orderId) => {
        const response = await api.get<Order>(`/admin/orders/${orderId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        await api.patch(`/admin/orders/${orderId}/status`, { status });
    },
}));

export default useAdminStore;
