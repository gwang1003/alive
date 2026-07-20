// 상품 카테고리(대/소분류 트리 노드)
export interface Category {
    categoryId: number;
    name: string;
    parentId?: number | null;
    displayOrder: number;
}