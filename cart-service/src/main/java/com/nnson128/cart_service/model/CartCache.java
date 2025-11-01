package com.nnson128.cart_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
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
public class CartCache implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String userId;
    private List<CartItemCache> items;
    private BigDecimal totalPrice;
    private Integer totalItems;
    
    @TimeToLive
    private Long ttl;
}
