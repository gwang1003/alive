package com.alive.domain.inquiry.service;

import com.alive.domain.inquiry.dto.InquiryCreateRequest;
import com.alive.domain.inquiry.dto.InquiryResponse;
import com.alive.domain.inquiry.entity.Inquiry;
import com.alive.domain.inquiry.entity.InquiryStatus;
import com.alive.domain.inquiry.repository.InquiryRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 1:1 문의 서비스 (등록/조회/답변)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    /**
     * 문의 등록
     */
    @Transactional
    public InquiryResponse createInquiry(String email, InquiryCreateRequest request) {
        User user = getUser(email);
        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        return InquiryResponse.fromEntity(inquiryRepository.save(inquiry));
    }

    /**
     * 내 문의 목록 조회
     */
    public List<InquiryResponse> getMyInquiries(String email) {
        User user = getUser(email);
        return inquiryRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(InquiryResponse::fromEntity)
                .toList();
    }

    /**
     * 내 문의 상세 조회 (본인 소유 문의만 조회 가능)
     */
    public InquiryResponse getMyInquiryDetail(String email, Long inquiryId) {
        User user = getUser(email);
        Inquiry inquiry = inquiryRepository.findByInquiryIdAndUserUserId(inquiryId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다"));
        return InquiryResponse.fromEntity(inquiry);
    }

    /**
     * 관리자용 문의 목록 조회 (상태 필터, 없으면 전체 조회)
     */
    public Page<InquiryResponse> getAdminInquiries(InquiryStatus status, Pageable pageable) {
        Page<Inquiry> inquiries = status != null
                ? inquiryRepository.findByStatus(status, pageable)
                : inquiryRepository.findAll(pageable);
        return inquiries.map(InquiryResponse::fromEntity);
    }

    /**
     * 관리자 답변 등록
     */
    @Transactional
    public InquiryResponse answerInquiry(Long inquiryId, String answer) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다"));
        inquiry.answer(answer);
        return InquiryResponse.fromEntity(inquiry);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
