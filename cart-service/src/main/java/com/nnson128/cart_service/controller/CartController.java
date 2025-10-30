package com.nnson128.cart_service.controller;

import com.nnson128.cart_service.dto.ApiResponse;
import com.nnson128.cart_service.dto.CartDTO;
import com.nnson128.cart_service.dto.CartItemDTO;
import com.nnson128.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(Authentication authentication) {
        String userId = authentication.getName();
        CartDTO cart = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Get cart successfully")
                .data(cart)
                .build());
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDTO>> addItemToCart(
            Authentication authentication,
            @RequestBody CartItemDTO itemDTO) {
        String userId = authentication.getName();
        CartDTO cart = cartService.addItemToCart(userId, itemDTO);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Item added to cart successfully")
                .data(cart)
                .build());
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            Authentication authentication,
            @PathVariable String productId,
            @RequestParam Integer quantity) {
        String userId = authentication.getName();
        CartDTO cart = cartService.updateCartItem(userId, productId, quantity);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Cart item updated successfully")
                .data(cart)
                .build());
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeItemFromCart(
            Authentication authentication,
            @PathVariable String productId) {
        String userId = authentication.getName();
        CartDTO cart = cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Item removed from cart successfully")
                .data(cart)
                .build());
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> clearCart(Authentication authentication) {
        String userId = authentication.getName();
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Cart cleared successfully")
                .build());
    }
}
