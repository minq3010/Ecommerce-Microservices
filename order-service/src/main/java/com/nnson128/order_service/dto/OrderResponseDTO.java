package com.nnson128.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private String id;
    private String userId;
    private BigDecimal totalPrice;
    private BigDecimal shippingCost;
    private BigDecimal taxAmount;
    private String status;
    private String shippingAddress;
    private String phoneNumber;
    private String notes;
    private String paymentStatus;
    private String paymentId;
    private Integer itemCount;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
