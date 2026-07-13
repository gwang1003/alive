export interface Address {
    addressId: number;
    recipientName: string;
    phone: string;
    zipcode: string;
    address: string;
    addressDetail: string | null;
    isDefault: boolean;
}

export interface AddressRequest {
    recipientName: string;
    phone: string;
    zipcode: string;
    address: string;
    addressDetail?: string;
    isDefault?: boolean;
}
