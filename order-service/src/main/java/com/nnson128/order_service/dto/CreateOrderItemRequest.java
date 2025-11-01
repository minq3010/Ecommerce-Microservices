package com.nnson128.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderItemRequest {
    @NotBlank(message = "Product ID is required")
    private String productId;
    
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;
}
