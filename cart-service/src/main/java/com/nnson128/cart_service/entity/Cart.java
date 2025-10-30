package com.nnson128.cart_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@RedisHash("Cart")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart implements Serializable {
    private String id; // userId
    private List<CartItem> items;
    private BigDecimal totalPrice;
    
    @TimeToLive
    private Long ttl;
}
