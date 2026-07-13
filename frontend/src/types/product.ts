export interface Category {
    categoryId: number;
    name: string;
    parentId?: number;
    displayOrder: number;
}

export interface Product {
    productId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    discountRate: number;
    gender: 'MALE' | 'FEMALE' | 'UNISEX';
    minAge?: number;
    maxAge?: number;
    thumbnailUrl?: string; // product_images 테이블 연동 시
}

export interface ProductListItem {
    productId: number;
    name: string;
    price: number;
    discountRate: number;
    finalPrice: number;
    images: string[];
    gender: string;
    minAge: number | null;
    maxAge: number | null;
    stockQuantity: number;
    viewCount: number;
    categoryName: string | null;
    isActive: boolean;
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

