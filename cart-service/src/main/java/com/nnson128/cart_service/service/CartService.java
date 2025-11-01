package com.nnson128.cart_service.service;

import com.nnson128.cart_service.client.ProductClient;
import com.nnson128.cart_service.dto.AddCartItemRequest;
import com.nnson128.cart_service.dto.CartDTO;
import com.nnson128.cart_service.dto.CartItemDTO;
import com.nnson128.cart_service.dto.ProductResponseDTO;
import com.nnson128.cart_service.model.Cart;
import com.nnson128.cart_service.model.CartItem;
import com.nnson128.cart_service.model.CartCache;
import com.nnson128.cart_service.model.CartItemCache;
import com.nnson128.cart_service.repository.CartJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartJpaRepository cartJpaRepository;
    private final CacheService cacheService;
    private final ProductClient productClient;

    /**
     * Get cart by userId
     * Process: Check Cache -> If not exists, get from DB -> Save to Cache -> Return to client
     */
    public CartDTO getCart(String userId) {
        // Step 1: Check cache first
        Optional<CartCache> cachedCart = cacheService.getFromCache(userId);
        if (cachedCart.isPresent()) {
            log.debug("Cart found in cache for userId: {}", userId);
            return mapCacheToDTO(cachedCart.get());
        }

        // Step 2: If not in cache, get from database
        Optional<Cart> dbCart = cartJpaRepository.findById(userId);
        if (dbCart.isPresent()) {
            log.debug("Cart found in database for userId: {}", userId);
            CartCache cartCache = mapEntityToCache(dbCart.get());
            
            // Step 3: Save to cache
            cacheService.saveToCache(cartCache);
            
            // Step 4: Return to client
            return mapCacheToDTO(cartCache);
        }

        // Return empty cart if not found
        log.debug("Cart not found for userId: {}, returning empty cart", userId);
        return CartDTO.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .totalPrice(BigDecimal.ZERO)
                .totalItems(0)
                .build();
    }

    /**
     * Add item to cart
     * Process: Get/Create cart from DB -> Add item with product details -> Save to DB -> Update cache -> Return to client
     */
    @Transactional
    public CartDTO addItemToCart(String userId, AddCartItemRequest request) {
        log.info("Adding item to cart for userId: {} with product: {}", userId, request.getProductId());

        // Get or create cart from database
        Cart cart = cartJpaRepository.findById(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .items(new ArrayList<>())
                            .totalPrice(BigDecimal.ZERO)
                            .build();
                    return cartJpaRepository.save(newCart);
                });

        // Load product details from Product Service
        ProductResponseDTO product = null;
        try {
            product = productClient.getProductById(request.getProductId());
            if (product == null) {
                log.warn("Product not found from Product Service for productId: {}", request.getProductId());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch product details from Product Service for productId: {}. Will continue with default values.", 
                request.getProductId(), e);
        }

        // Check if product already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // If product already in cart, just update quantity
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
            
            // Update product info if available
            if (product != null) {
                existingItem.get().setProductName(product.getName());
                existingItem.get().setPrice(product.getPrice());
                existingItem.get().setImageUrl(product.getImageUrl());
            }
            log.debug("Updated existing item quantity in cart for productId: {}", request.getProductId());
        } else {
            // For new product, create cart item
            CartItem newItem = CartItem.builder()
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .cart(cart)
                    .build();

            // Set product details if available
            if (product != null) {
                newItem.setProductName(product.getName());
                newItem.setPrice(product.getPrice());
                newItem.setImageUrl(product.getImageUrl());
                log.debug("Product details loaded from Product Service for productId: {}", request.getProductId());
            } else {
                // Use default values if product not found
                newItem.setProductName("Product #" + request.getProductId());
                newItem.setPrice(BigDecimal.ZERO);
            }

            cart.getItems().add(newItem);
            log.debug("Added new item to cart");
        }

        // Calculate total price
        calculateTotalPrice(cart);

        // Save to database
        Cart savedCart = cartJpaRepository.save(cart);
        log.debug("Cart saved to database for userId: {}", userId);

        // Update cache
        CartCache cartCache = mapEntityToCache(savedCart);
        cacheService.saveToCache(cartCache);

        return mapCacheToDTO(cartCache);
    }

    /**
     * Update cart item quantity
     * Process: Get cart from DB -> Update item -> Save to DB -> Update cache -> Return to client
     */
    @Transactional
    public CartDTO updateCartItem(String userId, String productId, Integer quantity) {
        log.info("Updating cart item for userId: {}, productId: {}, quantity: {}", userId, productId, quantity);

        Cart cart = cartJpaRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("Cart not found for userId: {}", userId);
                    return new RuntimeException("Cart not found");
                });

        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        item -> {
                            item.setQuantity(quantity);
                            log.debug("Item quantity updated for productId: {}", productId);
                        },
                        () -> {
                            log.error("Product not found in cart for productId: {}", productId);
                            throw new RuntimeException("Product not found in cart");
                        }
                );

        // Calculate total price
        calculateTotalPrice(cart);

        // Save to database
        Cart savedCart = cartJpaRepository.save(cart);
        log.debug("Cart updated in database for userId: {}", userId);

        // Update cache
        CartCache cartCache = mapEntityToCache(savedCart);
        cacheService.saveToCache(cartCache);

        return mapCacheToDTO(cartCache);
    }

    /**
     * Remove item from cart
     * Process: Get cart from DB -> Remove item -> Save to DB -> Update cache -> Return to client
     */
    @Transactional
    public CartDTO removeItemFromCart(String userId, String productId) {
        log.info("Removing item from cart for userId: {}, productId: {}", userId, productId);

        Cart cart = cartJpaRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("Cart not found for userId: {}", userId);
                    return new RuntimeException("Cart not found");
                });

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));

        // Calculate total price
        calculateTotalPrice(cart);

        // Save to database
        Cart savedCart = cartJpaRepository.save(cart);
        log.debug("Item removed from cart in database for userId: {}", userId);

        // Update cache
        CartCache cartCache = mapEntityToCache(savedCart);
        cacheService.saveToCache(cartCache);

        return mapCacheToDTO(cartCache);
    }

    /**
     * Clear cart
     * Process: Delete from DB -> Delete from cache
     */
    @Transactional
    public void clearCart(String userId) {
        log.info("Clearing cart for userId: {}", userId);

        // Delete from database
        cartJpaRepository.deleteById(userId);
        log.debug("Cart deleted from database for userId: {}", userId);

        // Delete from cache
        cacheService.deleteFromCache(userId);
        log.debug("Cart deleted from cache for userId: {}", userId);
    }

    /**
     * Calculate total price and items count
     */
    private void calculateTotalPrice(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(itemTotal);
        }
        cart.setTotalPrice(total);
    }

    /**
     * Map Cart entity to CartCache
     */
    private CartCache mapEntityToCache(Cart entity) {
        List<CartItemCache> items = entity.getItems().stream()
                .map(item -> CartItemCache.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .imageUrl(item.getImageUrl())
                        .build())
                .collect(Collectors.toList());

        return CartCache.builder()
                .userId(entity.getUserId())
                .items(items)
                .totalPrice(entity.getTotalPrice())
                .totalItems(entity.getItems().size())
                .ttl(7 * 24 * 60 * 60L) // 7 days in seconds
                .build();
    }

    /**
     * Map CartCache to CartDTO
     */
    private CartDTO mapCacheToDTO(CartCache cache) {
        List<CartItemDTO> items = cache.getItems().stream()
                .map(item -> CartItemDTO.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .imageUrl(item.getImageUrl())
                        .build())
                .collect(Collectors.toList());

        return CartDTO.builder()
                .userId(cache.getUserId())
                .items(items)
                .totalPrice(cache.getTotalPrice())
                .totalItems(cache.getTotalItems())
                .build();
    }
}
