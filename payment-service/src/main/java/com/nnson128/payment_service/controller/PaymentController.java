package com.nnson128.payment_service.controller;

import com.nnson128.payment_service.dto.*;
import com.nnson128.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ==================== CREATE & PROCESS ====================

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> createPayment(
            Authentication authentication,
            @RequestBody PaymentRequestDTO request) {
        String userId = authentication.getName();
        PaymentResponseDTO data = paymentService.createPayment(userId, request);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Payment created successfully")
                .data(data)
                .build());
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> processPayment(@PathVariable String id) {
        PaymentResponseDTO data = paymentService.processPayment(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Payment processed successfully")
                .data(data)
                .build());
    }

    // ==================== REFUND & RETRY ====================

    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> refundPayment(@PathVariable String id) {
        PaymentResponseDTO data = paymentService.refundPayment(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Payment refunded successfully")
                .data(data)
                .build());
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> retryPayment(@PathVariable String id) {
        PaymentResponseDTO data = paymentService.retryPayment(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Payment retry initiated successfully")
                .data(data)
                .build());
    }

    // ==================== RETRIEVE ====================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPaymentById(@PathVariable String id) {
        PaymentResponseDTO data = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Get payment successfully")
                .data(data)
                .build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPaymentByOrderId(@PathVariable String orderId) {
        PaymentResponseDTO data = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Get payment successfully")
                .data(data)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getUserPayments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponseDTO> data = paymentService.getUserPayments(userId, pageable);
        return ResponseEntity.ok(ApiResponse.<Page<PaymentResponseDTO>>builder()
                .success(true)
                .message("Get user payments successfully")
                .data(data)
                .build());
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponseDTO> data = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<PaymentResponseDTO>>builder()
                .success(true)
                .message("Get all payments successfully")
                .data(data)
                .build());
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getPaymentsByStatus(@PathVariable String status) {
        List<PaymentResponseDTO> data = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponseDTO>>builder()
                .success(true)
                .message("Get payments by status successfully")
                .data(data)
                .build());
    }

    @GetMapping("/admin/method/{method}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getPaymentsByMethod(@PathVariable String method) {
        List<PaymentResponseDTO> data = paymentService.getPaymentsByMethod(method);
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponseDTO>>builder()
                .success(true)
                .message("Get payments by method successfully")
                .data(data)
                .build());
    }

    // ==================== STATISTICS ====================

    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentStatisticsDTO>> getPaymentStatistics() {
        PaymentStatisticsDTO data = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(ApiResponse.<PaymentStatisticsDTO>builder()
                .success(true)
                .message("Get payment statistics successfully")
                .data(data)
                .build());
    }

    @GetMapping("/admin/revenue/by-method")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentMethodRevenueDTO>>> getRevenueByPaymentMethod() {
        List<PaymentMethodRevenueDTO> data = paymentService.getRevenueByPaymentMethod();
        return ResponseEntity.ok(ApiResponse.<List<PaymentMethodRevenueDTO>>builder()
                .success(true)
                .message("Get revenue by payment method successfully")
                .data(data)
                .build());
    }
}
