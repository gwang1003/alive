// 메인 노출 배너 정보
export interface Banner {
    bannerId: number;
    title: string;
    imageUrl: string;
    linkUrl: string | null;
    displayOrder: number;
    isActive: boolean;
}
