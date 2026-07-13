package com.alive.domain.inquiry.controller;

import com.alive.domain.inquiry.dto.InquiryAnswerRequest;
import com.alive.domain.inquiry.dto.InquiryResponse;
import com.alive.domain.inquiry.entity.InquiryStatus;
import com.alive.domain.inquiry.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminInquiryController {

    private final InquiryService inquiryService;

    /**
     * 전체 문의 목록 조회 (상태 필터 가능)
     * GET /api/admin/inquiries?status=&page&size
     */
    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getInquiries(
            @RequestParam(required = false) InquiryStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(inquiryService.getAdminInquiries(status, pageable));
    }

    /**
     * 문의 답변 등록
     * PATCH /api/admin/inquiries/{inquiryId}/answer
     */
    @PatchMapping("/{inquiryId}/answer")
    public ResponseEntity<InquiryResponse> answerInquiry(
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryAnswerRequest request
    ) {
        return ResponseEntity.ok(inquiryService.answerInquiry(inquiryId, request.getAnswer()));
    }
}
