package com.nnson128.cart_service.dto;

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
public class CartDTO {
    private String userId;
    private List<CartItemDTO> items;
    private BigDecimal totalPrice;
    private Integer totalItems;
}
