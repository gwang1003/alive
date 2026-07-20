package com.alive.domain.inquiry.repository;

import com.alive.domain.inquiry.entity.Inquiry;
import com.alive.domain.inquiry.entity.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 문의 리포지토리
 */
@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    /** 특정 사용자의 문의 목록을 최신순으로 조회 */
    List<Inquiry> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    /** 특정 사용자 소유의 문의를 ID로 조회 */
    Optional<Inquiry> findByInquiryIdAndUserUserId(Long inquiryId, Long userId);

    /** 상태별 문의를 페이지 단위로 조회 */
    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);
}
