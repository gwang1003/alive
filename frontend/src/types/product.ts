// 상품 카테고리
export interface Category {
    categoryId: number;
    name: string;
    parentId?: number;
    displayOrder: number;
}

// 상품 상세 정보
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

// 목록/검색 화면에 쓰이는 상품 요약 정보
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

