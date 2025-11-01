package com.nnson128.payment_service.service;

import com.nnson128.payment_service.client.OrderClient;
import com.nnson128.payment_service.dto.OrderResponseDTO;
import com.nnson128.payment_service.dto.PaymentMethodRevenueDTO;
import com.nnson128.payment_service.dto.PaymentRequestDTO;
import com.nnson128.payment_service.dto.PaymentResponseDTO;
import com.nnson128.payment_service.dto.PaymentStatisticsDTO;
import com.nnson128.payment_service.entity.Payment;
import com.nnson128.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;

    // ==================== CREATE & PROCESS ====================

    // Create payment
    public PaymentResponseDTO createPayment(String userId, PaymentRequestDTO request) {
        // Get order details from Order Service
        OrderResponseDTO order = null;
        try {
            order = orderClient.getOrderById(request.getOrderId());
        } catch (Exception e) {
            log.error("Failed to fetch order details for orderId: {}", request.getOrderId(), e);
            throw new RuntimeException("Failed to fetch order details for orderId: " + request.getOrderId(), e);
        }

        if (order == null) {
            log.error("Order not found: {}", request.getOrderId());
            throw new RuntimeException("Order not found: " + request.getOrderId());
        }

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(userId)
                .amount(order.getTotalPrice())
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING")
                .description("Payment for order: " + request.getOrderId())
                .transactionId(UUID.randomUUID().toString())
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment created: {} for order: {}", saved.getId(), request.getOrderId());
        return mapToDTO(saved);
    }

    // Process payment (simulate payment gateway)
    @Transactional
    public PaymentResponseDTO processPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"PENDING".equals(payment.getStatus())) {
            throw new RuntimeException("Payment is already processed");
        }

        // Simulate payment processing with 95% success rate
        try {
            Thread.sleep(1000); // Simulate gateway delay
            if (Math.random() > 0.05) { // 95% success rate
                payment.setStatus("COMPLETED");
                log.info("Payment processed successfully: {}", paymentId);
            } else {
                payment.setStatus("FAILED");
                log.warn("Payment processing failed: {}", paymentId);
            }
        } catch (InterruptedException e) {
            payment.setStatus("FAILED");
            log.error("Payment processing interrupted: {}", paymentId, e);
        }

        Payment updated = paymentRepository.save(payment);
        return mapToDTO(updated);
    }

    // ==================== REFUND & RETRY ====================

    // Refund payment
    @Transactional
    public PaymentResponseDTO refundPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"COMPLETED".equals(payment.getStatus())) {
            throw new RuntimeException("Only completed payments can be refunded");
        }

        payment.setStatus("REFUNDED");
        Payment updated = paymentRepository.save(payment);
        log.info("Payment refunded: {}", paymentId);
        return mapToDTO(updated);
    }

    // Retry failed payment
    @Transactional
    public PaymentResponseDTO retryPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"FAILED".equals(payment.getStatus())) {
            throw new RuntimeException("Only failed payments can be retried");
        }

        payment.setStatus("PENDING");
        payment.setTransactionId(UUID.randomUUID().toString());
        Payment updated = paymentRepository.save(payment);
        log.info("Payment retry initiated: {}", paymentId);
        return mapToDTO(updated);
    }

    // ==================== RETRIEVE ====================

    // Get payment by ID
    public PaymentResponseDTO getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToDTO(payment);
    }

    // Get payment by order ID
    public PaymentResponseDTO getPaymentByOrderId(String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));
        return mapToDTO(payment);
    }

    // Get user payments with pagination
    public Page<PaymentResponseDTO> getUserPayments(String userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable)
                .map(this::mapToDTO);
    }

    // Get all payments (admin)
    public Page<PaymentResponseDTO> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    // ==================== STATISTICS & FILTERS ====================

    // Get payments by status
    public List<PaymentResponseDTO> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get payments by payment method
    public List<PaymentResponseDTO> getPaymentsByMethod(String paymentMethod) {
        return paymentRepository.findByPaymentMethod(paymentMethod).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get payment statistics
    public PaymentStatisticsDTO getPaymentStatistics() {
        List<Payment> allPayments = paymentRepository.findAll();

        long completedCount = allPayments.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .count();

        long failedCount = allPayments.stream()
                .filter(p -> "FAILED".equals(p.getStatus()))
                .count();

        long refundedCount = allPayments.stream()
                .filter(p -> "REFUNDED".equals(p.getStatus()))
                .count();

        long pendingCount = allPayments.stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();

        BigDecimal totalAmount = allPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal completedAmount = allPayments.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double successRate = allPayments.isEmpty() ? 0 :
                (double) completedCount / allPayments.size() * 100;

        return PaymentStatisticsDTO.builder()
                .totalPayments(allPayments.size())
                .completedCount(completedCount)
                .failedCount(failedCount)
                .refundedCount(refundedCount)
                .pendingCount(pendingCount)
                .totalAmount(totalAmount)
                .completedAmount(completedAmount)
                .successRate(successRate)
                .build();
    }

    // Get revenue by payment method
    public List<PaymentMethodRevenueDTO> getRevenueByPaymentMethod() {
        return paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .collect(Collectors.groupingBy(
                        Payment::getPaymentMethod,
                        Collectors.reducing(BigDecimal.ZERO,
                                Payment::getAmount,
                                BigDecimal::add)
                ))
                .entrySet().stream()
                .map(e -> PaymentMethodRevenueDTO.builder()
                        .paymentMethod(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    // ==================== HELPER ====================

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
