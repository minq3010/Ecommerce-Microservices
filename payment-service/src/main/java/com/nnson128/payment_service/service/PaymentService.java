package com.nnson128.payment_service.service;

import com.nnson128.payment_service.dto.PaymentRequestDTO;
import com.nnson128.payment_service.dto.PaymentResponseDTO;
import com.nnson128.payment_service.entity.Payment;
import com.nnson128.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // Create payment
    public PaymentResponseDTO createPayment(String userId, PaymentRequestDTO request) {
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(userId)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING")
                .description(request.getDescription())
                .transactionId(UUID.randomUUID().toString())
                .build();

        Payment saved = paymentRepository.save(payment);
        return mapToDTO(saved);
    }

    // Process payment
    public PaymentResponseDTO processPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Simulate payment processing
        if (Math.random() > 0.1) { // 90% success rate
            payment.setStatus("COMPLETED");
        } else {
            payment.setStatus("FAILED");
        }

        Payment updated = paymentRepository.save(payment);
        return mapToDTO(updated);
    }

    // Refund payment
    public PaymentResponseDTO refundPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"COMPLETED".equals(payment.getStatus())) {
            throw new RuntimeException("Only completed payments can be refunded");
        }

        payment.setStatus("REFUNDED");
        Payment updated = paymentRepository.save(payment);
        return mapToDTO(updated);
    }

    // Get payment by ID
    public PaymentResponseDTO getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToDTO(payment);
    }

    // Get payment by order ID
    public PaymentResponseDTO getPaymentByOrderId(String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToDTO(payment);
    }

    // Get user payments
    public List<PaymentResponseDTO> getUserPayments(String userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PaymentResponseDTO mapToDTO(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .description(payment.getDescription())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
