package com.alive.domain.order.controller;

import com.alive.domain.order.dto.BulkOrderStatusUpdateRequest;
import com.alive.domain.order.dto.OrderResponse;
import com.alive.domain.order.dto.OrderStatusUpdateRequest;
import com.alive.domain.order.entity.OrderStatus;
import com.alive.domain.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
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
     * 전체 주문 목록 조회 (상태 필터 가능)
     * GET /api/admin/orders?status=&page&size
     */
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20, sort = "orderedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getAdminOrders(status, pageable));
    }

    /**
     * 주문 상세 조회 (유저 스코프 없이)
     * GET /api/admin/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetail(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getAdminOrderDetail(orderId));
    }

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

    /**
     * 주문 상태 일괄 변경
     * PATCH /api/admin/orders/status
     */
    @PatchMapping("/status")
    public ResponseEntity<Void> updateOrderStatusBulk(@Valid @RequestBody BulkOrderStatusUpdateRequest request) {
        orderService.updateOrderStatusBulk(request.getOrderIds(), request.getStatus());
        return ResponseEntity.noContent().build();
    }
}
