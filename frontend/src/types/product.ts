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

