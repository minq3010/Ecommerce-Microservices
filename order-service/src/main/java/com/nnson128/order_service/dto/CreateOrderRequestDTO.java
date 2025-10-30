package com.nnson128.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDTO {
    private List<OrderItemDTO> items;
    private String shippingAddress;
    private String phoneNumber;
    private BigDecimal shippingCost;
    private BigDecimal taxAmount;
    private String notes;
}
