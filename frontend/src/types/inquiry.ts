// 문의 답변 상태
export type InquiryStatus = 'PENDING' | 'ANSWERED';

// 1:1 상품/서비스 문의
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

// 문의 등록 요청 payload
export interface InquiryCreateRequest {
    title: string;
    content: string;
}
