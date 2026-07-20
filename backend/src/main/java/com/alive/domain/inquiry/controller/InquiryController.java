package com.alive.domain.inquiry.controller;

import com.alive.domain.inquiry.dto.InquiryCreateRequest;
import com.alive.domain.inquiry.dto.InquiryResponse;
import com.alive.domain.inquiry.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자용 1:1 문의 API 컨트롤러
 */
@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    /**
     * 내 문의 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getMyInquiries() {
        return ResponseEntity.ok(inquiryService.getMyInquiries(currentEmail()));
    }

    /**
     * 내 문의 상세 조회
     */
    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> getMyInquiryDetail(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(inquiryService.getMyInquiryDetail(currentEmail(), inquiryId));
    }

    /**
     * 문의 등록
     */
    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@Valid @RequestBody InquiryCreateRequest request) {
        InquiryResponse response = inquiryService.createInquiry(currentEmail(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
