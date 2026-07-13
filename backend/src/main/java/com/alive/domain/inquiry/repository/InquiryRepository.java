package com.alive.domain.inquiry.repository;

import com.alive.domain.inquiry.entity.Inquiry;
import com.alive.domain.inquiry.entity.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Inquiry> findByInquiryIdAndUserUserId(Long inquiryId, Long userId);

    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);
}
