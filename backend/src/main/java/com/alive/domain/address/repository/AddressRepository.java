package com.alive.domain.address.repository;

import com.alive.domain.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<Address> findByAddressIdAndUserUserId(Long addressId, Long userId);
}
