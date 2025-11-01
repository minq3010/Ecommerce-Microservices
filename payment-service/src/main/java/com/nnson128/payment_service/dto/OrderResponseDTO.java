package com.nnson128.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private String id;
    private String userId;
    private BigDecimal totalPrice;
    private String status;
    private String paymentStatus;
    private String shippingAddress;
    private String phoneNumber;
    private List<OrderItemDTO> items;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderItemDTO {
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}
