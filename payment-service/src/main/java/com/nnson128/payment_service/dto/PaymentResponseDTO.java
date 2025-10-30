package com.nnson128.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
