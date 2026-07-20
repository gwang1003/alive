package com.alive.domain.payment.controller;

import com.alive.domain.payment.dto.PaymentConfirmRequest;
import com.alive.domain.payment.dto.PaymentResponse;
import com.alive.domain.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 결제 API 컨트롤러. 토스페이먼츠 결제 승인 요청을 처리한다.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 토스페이먼츠 결제 승인
     * POST /api/payments/confirm
     */
    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponse> confirmPayment(@Valid @RequestBody PaymentConfirmRequest request) {
        return ResponseEntity.ok(paymentService.confirmPayment(currentEmail(), request));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
