export type InquiryStatus = 'PENDING' | 'ANSWERED';

export interface Inquiry {
    inquiryId: number;
    title: string;
    content: string;
    answer: string | null;
    status: InquiryStatus;
    createdAt: string;
    answeredAt: string | null;
    userName: string;
}

export interface InquiryCreateRequest {
    title: string;
    content: string;
}
