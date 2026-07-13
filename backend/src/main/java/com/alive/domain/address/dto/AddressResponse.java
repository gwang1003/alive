package com.alive.domain.address.dto;

import com.alive.domain.address.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long addressId;
    private String recipientName;
    private String phone;
    private String zipcode;
    private String address;
    private String addressDetail;
    private Boolean isDefault;

    public static AddressResponse fromEntity(Address address) {
        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .zipcode(address.getZipcode())
                .address(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .isDefault(address.getIsDefault())
                .build();
    }
}
