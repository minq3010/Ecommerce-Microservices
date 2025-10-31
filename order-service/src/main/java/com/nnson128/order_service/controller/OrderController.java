package com.nnson128.order_service.controller;

import com.nnson128.order_service.dto.ApiResponse;
import com.nnson128.order_service.dto.CreateOrderRequestDTO;
import com.nnson128.order_service.dto.OrderResponseDTO;
import com.nnson128.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            Authentication authentication,
            @RequestBody CreateOrderRequestDTO request) {
        String userId = authentication.getName();
        OrderResponseDTO data = orderService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.<OrderResponseDTO>builder()
                .success(true)
                .message("Order created successfully")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        OrderResponseDTO data = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(ApiResponse.<OrderResponseDTO>builder()
                .success(true)
                .message("Get order successfully")
                .data(data)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getUserOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = authentication.getName();
        Page<OrderResponseDTO> data = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(ApiResponse.<Page<OrderResponseDTO>>builder()
                .success(true)
                .message("Get user orders successfully")
                .data(data)
                .build());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderResponseDTO> data = orderService.getAllOrders(page, size);
        log.info("Get all orders successfully");
        return ResponseEntity.ok(ApiResponse.<Page<OrderResponseDTO>>builder()
                .success(true)
                .message("Get all orders successfully")
                .data(data)
                .build());
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getOrdersByStatus(@PathVariable String status) {
        List<OrderResponseDTO> data = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.<List<OrderResponseDTO>>builder()
                .success(true)
                .message("Get orders by status successfully")
                .data(data)
                .build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status) {
        OrderResponseDTO data = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<OrderResponseDTO>builder()
                .success(true)
                .message("Order status updated successfully")
                .data(data)
                .build());
    }

    @PutMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updatePaymentStatus(
            @PathVariable String id,
            @RequestParam String paymentStatus,
            @RequestParam(required = false) String paymentId) {
        OrderResponseDTO data = orderService.updatePaymentStatus(id, paymentStatus, paymentId);
        return ResponseEntity.ok(ApiResponse.<OrderResponseDTO>builder()
                .success(true)
                .message("Payment status updated successfully")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> cancelOrder(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        orderService.cancelOrder(id, userId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Order cancelled successfully")
                .build());
    }
}
