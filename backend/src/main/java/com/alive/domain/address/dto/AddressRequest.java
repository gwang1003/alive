package com.alive.domain.address.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    @NotBlank(message = "받는 분 성함은 필수입니다")
    private String recipientName;

    @NotBlank(message = "연락처는 필수입니다")
    private String phone;

    @NotBlank(message = "우편번호는 필수입니다")
    private String zipcode;

    @NotBlank(message = "주소는 필수입니다")
    private String address;

    private String addressDetail;

    private Boolean isDefault;
}
