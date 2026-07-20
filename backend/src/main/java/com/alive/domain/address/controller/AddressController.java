package com.alive.domain.address.controller;

import com.alive.domain.address.dto.AddressRequest;
import com.alive.domain.address.dto.AddressResponse;
import com.alive.domain.address.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 회원 배송지(배송지록) CRUD API 컨트롤러
 */
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * 로그인한 사용자의 배송지 목록을 조회한다.
     */
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {
        return ResponseEntity.ok(addressService.getMyAddresses(currentEmail()));
    }

    /**
     * 새 배송지를 등록한다.
     */
    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(@Valid @RequestBody AddressRequest request) {
        AddressResponse response = addressService.addAddress(currentEmail(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 배송지 정보를 수정한다.
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(addressService.updateAddress(currentEmail(), addressId, request));
    }

    /**
     * 배송지를 삭제한다.
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(currentEmail(), addressId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 특정 배송지를 기본 배송지로 지정한다.
     */
    @PatchMapping("/{addressId}/default")
    public ResponseEntity<Void> setDefault(@PathVariable Long addressId) {
        addressService.setDefault(currentEmail(), addressId);
        return ResponseEntity.noContent().build();
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
