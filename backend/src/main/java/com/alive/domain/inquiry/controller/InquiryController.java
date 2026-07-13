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

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getMyInquiries() {
        return ResponseEntity.ok(inquiryService.getMyInquiries(currentEmail()));
    }

    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> getMyInquiryDetail(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(inquiryService.getMyInquiryDetail(currentEmail(), inquiryId));
    }

    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@Valid @RequestBody InquiryCreateRequest request) {
        InquiryResponse response = inquiryService.createInquiry(currentEmail(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
