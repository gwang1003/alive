package com.alive.domain.order.controller;

import com.alive.domain.order.dto.OrderResponse;
import com.alive.domain.order.dto.OrderStatusUpdateRequest;
import com.alive.domain.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * 주문 상태 변경
     * PATCH /api/admin/orders/{orderId}/status
     */
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request.getStatus()));
    }
}
