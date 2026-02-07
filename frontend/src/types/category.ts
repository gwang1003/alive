export interface Category {
    categoryId: number;
    name: string;
    parentId?: number | null;
    displayOrder: number;
}