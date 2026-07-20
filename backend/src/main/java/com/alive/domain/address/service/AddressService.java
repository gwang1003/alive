package com.alive.domain.address.service;

import com.alive.domain.address.dto.AddressRequest;
import com.alive.domain.address.dto.AddressResponse;
import com.alive.domain.address.entity.Address;
import com.alive.domain.address.repository.AddressRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 배송지 CRUD 및 기본 배송지 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    /**
     * 회원의 배송지 목록을 조회한다.
     */
    public List<AddressResponse> getMyAddresses(String email) {
        User user = getUser(email);
        return addressRepository.findByUserUserIdOrderByIsDefaultDescCreatedAtDesc(user.getUserId()).stream()
                .map(AddressResponse::fromEntity)
                .toList();
    }

    /**
     * 배송지를 신규 등록한다. 기본 배송지로 지정되거나 첫 배송지인 경우 기존 배송지의 기본 표시를 해제한다.
     */
    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = getUser(email);
        List<Address> existing = addressRepository.findByUserUserIdOrderByIsDefaultDescCreatedAtDesc(user.getUserId());

        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault()) || existing.isEmpty();
        if (shouldBeDefault) {
            existing.forEach(Address::unmarkDefault);
        }

        Address address = Address.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .zipcode(request.getZipcode())
                .address(request.getAddress())
                .addressDetail(request.getAddressDetail())
                .isDefault(shouldBeDefault)
                .build();

        return AddressResponse.fromEntity(addressRepository.save(address));
    }

    /**
     * 배송지 정보를 수정한다. 기본 배송지로 변경 요청 시 setDefault를 함께 호출한다.
     */
    @Transactional
    public AddressResponse updateAddress(String email, Long addressId, AddressRequest request) {
        User user = getUser(email);
        Address address = addressRepository.findByAddressIdAndUserUserId(addressId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다"));

        address.update(request.getRecipientName(), request.getPhone(), request.getZipcode(),
                request.getAddress(), request.getAddressDetail());

        if (Boolean.TRUE.equals(request.getIsDefault()) && !address.getIsDefault()) {
            setDefault(email, addressId);
        }

        return AddressResponse.fromEntity(address);
    }

    /**
     * 배송지를 삭제한다.
     */
    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getUser(email);
        Address address = addressRepository.findByAddressIdAndUserUserId(addressId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다"));
        addressRepository.delete(address);
    }

    /**
     * 지정한 배송지를 기본 배송지로 설정하고 나머지는 기본 표시를 해제한다.
     */
    @Transactional
    public void setDefault(String email, Long addressId) {
        User user = getUser(email);
        List<Address> existing = addressRepository.findByUserUserIdOrderByIsDefaultDescCreatedAtDesc(user.getUserId());
        existing.forEach(Address::unmarkDefault);

        Address target = existing.stream()
                .filter(a -> a.getAddressId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다"));
        target.markDefault();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
