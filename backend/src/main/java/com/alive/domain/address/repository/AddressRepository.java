package com.alive.domain.address.repository;

import com.alive.domain.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 배송지 JPA 리포지토리
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // 특정 회원의 배송지를 기본 배송지 우선, 최신순으로 조회
    List<Address> findByUserUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);

    // 회원 소유의 특정 배송지를 조회
    Optional<Address> findByAddressIdAndUserUserId(Long addressId, Long userId);
}
