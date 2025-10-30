package com.nnson128.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
