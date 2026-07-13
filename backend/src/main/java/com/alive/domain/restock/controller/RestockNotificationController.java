package com.alive.domain.restock.controller;

import com.alive.domain.restock.dto.RestockNotificationResponse;
import com.alive.domain.restock.service.RestockNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restock-notifications")
@RequiredArgsConstructor
public class RestockNotificationController {

    private final RestockNotificationService restockNotificationService;

    /**
     * 재입고 알림 신청
     * POST /api/restock-notifications/{stockId}
     */
    @PostMapping("/{stockId}")
    public ResponseEntity<RestockNotificationResponse> requestNotification(@PathVariable Long stockId) {
        RestockNotificationResponse response = restockNotificationService.requestNotification(currentEmail(), stockId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 재입고 알림 신청 취소
     * DELETE /api/restock-notifications/{stockId}
     */
    @DeleteMapping("/{stockId}")
    public ResponseEntity<Void> cancelNotification(@PathVariable Long stockId) {
        restockNotificationService.cancelNotification(currentEmail(), stockId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 특정 옵션에 대해 내가 이미 신청했는지 여부
     * GET /api/restock-notifications/{stockId}
     */
    @GetMapping("/{stockId}")
    public ResponseEntity<Boolean> hasRequested(@PathVariable Long stockId) {
        return ResponseEntity.ok(restockNotificationService.hasRequested(currentEmail(), stockId));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
