package com.nnson128.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddCartItemRequest {
    @NotBlank(message = "Product ID is required")
    private String productId;
    
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;
}
