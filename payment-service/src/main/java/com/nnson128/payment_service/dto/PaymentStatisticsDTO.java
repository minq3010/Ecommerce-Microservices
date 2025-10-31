package com.nnson128.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatisticsDTO {
    private long totalPayments;
    private long completedCount;
    private long failedCount;
    private long refundedCount;
    private long pendingCount;
    private BigDecimal totalAmount;
    private BigDecimal completedAmount;
    private double successRate;
}
