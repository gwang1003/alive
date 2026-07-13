import { create } from 'zustand';
import api from '../api/axios';
import { Address, AddressRequest } from '../types/address';

interface AddressState {
    addresses: Address[];
    isLoading: boolean;
    fetchAddresses: () => Promise<void>;
    addAddress: (request: AddressRequest) => Promise<void>;
    updateAddress: (addressId: number, request: AddressRequest) => Promise<void>;
    deleteAddress: (addressId: number) => Promise<void>;
    setDefault: (addressId: number) => Promise<void>;
}

const useAddressStore = create<AddressState>((set, get) => ({
    addresses: [],
    isLoading: false,

    fetchAddresses: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<Address[]>('/addresses');
            set({ addresses: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    addAddress: async (request) => {
        await api.post('/addresses', request);
        await get().fetchAddresses();
    },

    updateAddress: async (addressId, request) => {
        await api.put(`/addresses/${addressId}`, request);
        await get().fetchAddresses();
    },

    deleteAddress: async (addressId) => {
        await api.delete(`/addresses/${addressId}`);
        await get().fetchAddresses();
    },

    setDefault: async (addressId) => {
        await api.patch(`/addresses/${addressId}/default`);
        await get().fetchAddresses();
    },
}));

export default useAddressStore;
