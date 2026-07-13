export interface Banner {
    bannerId: number;
    title: string;
    imageUrl: string;
    linkUrl: string | null;
    displayOrder: number;
    isActive: boolean;
}
