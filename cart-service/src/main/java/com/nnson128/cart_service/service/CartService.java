package com.nnson128.cart_service.service;

import com.nnson128.cart_service.dto.CartDTO;
import com.nnson128.cart_service.dto.CartItemDTO;
import com.nnson128.cart_service.entity.Cart;
import com.nnson128.cart_service.entity.CartItem;
import com.nnson128.cart_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    // Get cart by user ID
    public CartDTO getCart(String userId) {
        Optional<Cart> cartOpt = cartRepository.findById(userId);
        if (cartOpt.isPresent()) {
            return mapToDTO(cartOpt.get());
        }
        return CartDTO.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .totalPrice(BigDecimal.ZERO)
                .totalItems(0)
                .build();
    }

    // Add item to cart
    public CartDTO addItemToCart(String userId, CartItemDTO itemDTO) {
        Cart cart = cartRepository.findById(userId)
                .orElseGet(() -> Cart.builder()
                        .id(userId)
                        .items(new ArrayList<>())
                        .totalPrice(BigDecimal.ZERO)
                        .ttl(7 * 24 * 60 * 60L) // 7 days
                        .build());

        CartItem newItem = CartItem.builder()
                .productId(itemDTO.getProductId())
                .productName(itemDTO.getProductName())
                .price(itemDTO.getPrice())
                .quantity(itemDTO.getQuantity())
                .imageUrl(itemDTO.getImageUrl())
                .addedAt(LocalDateTime.now())
                .build();

        // Check if product already exists
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(itemDTO.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + itemDTO.getQuantity());
        } else {
            cart.getItems().add(newItem);
        }

        calculateTotalPrice(cart);
        cartRepository.save(cart);
        return mapToDTO(cart);
    }

    // Update cart item quantity
    public CartDTO updateCartItem(String userId, String productId, Integer quantity) {
        Cart cart = cartRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(quantity),
                        () -> {
                            throw new RuntimeException("Product not found in cart");
                        }
                );

        calculateTotalPrice(cart);
        cartRepository.save(cart);
        return mapToDTO(cart);
    }

    // Remove item from cart
    public CartDTO removeItemFromCart(String userId, String productId) {
        Cart cart = cartRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        calculateTotalPrice(cart);
        cartRepository.save(cart);
        return mapToDTO(cart);
    }

    // Clear cart
    public void clearCart(String userId) {
        cartRepository.deleteById(userId);
    }

    // Calculate total price
    private void calculateTotalPrice(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(itemTotal);
        }
        cart.setTotalPrice(total);
    }

    private CartDTO mapToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(item -> CartItemDTO.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .imageUrl(item.getImageUrl())
                        .build())
                .toList();

        return CartDTO.builder()
                .userId(cart.getId())
                .items(itemDTOs)
                .totalPrice(cart.getTotalPrice())
                .totalItems(cart.getItems().size())
                .build();
    }
}
