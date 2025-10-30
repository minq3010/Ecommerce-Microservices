package com.nnson128.payment_service.controller;

import com.nnson128.payment_service.dto.ApiResponse;
import com.nnson128.payment_service.dto.PaymentRequestDTO;
import com.nnson128.payment_service.dto.PaymentResponseDTO;
import com.nnson128.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

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

    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> refundPayment(@PathVariable String id) {
        PaymentResponseDTO data = paymentService.refundPayment(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                .success(true)
                .message("Payment refunded successfully")
                .data(data)
                .build());
    }

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
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getUserPayments(Authentication authentication) {
        String userId = authentication.getName();
        List<PaymentResponseDTO> data = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponseDTO>>builder()
                .success(true)
                .message("Get user payments successfully")
                .data(data)
                .build());
    }
}
