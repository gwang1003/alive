// 배송지 정보
export interface Address {
    addressId: number;
    recipientName: string;
    phone: string;
    zipcode: string;
    address: string;
    addressDetail: string | null;
    isDefault: boolean;
}

// 배송지 등록/수정 요청 payload
export interface AddressRequest {
    recipientName: string;
    phone: string;
    zipcode: string;
    address: string;
    addressDetail?: string;
    isDefault?: boolean;
}
