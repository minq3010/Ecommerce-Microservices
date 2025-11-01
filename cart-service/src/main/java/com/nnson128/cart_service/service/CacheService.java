package com.nnson128.cart_service.service;

import com.nnson128.cart_service.model.CartCache;
import com.nnson128.cart_service.repository.CartCacheRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheService {

    private final CartCacheRepository cartCacheRepository;

    private static final long CACHE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

    /**
     * Get cart from cache
     */
    public Optional<CartCache> getFromCache(String userId) {
        try {
            return cartCacheRepository.findByUserId(userId);
        } catch (Exception e) {
            log.warn("Failed to get cart from cache for userId: {}", userId, e);
            return Optional.empty();
        }
    }

    /**
     * Save cart to cache
     */
    public void saveToCache(CartCache cart) {
        try {
            if (cart.getTtl() == null) {
                cart.setTtl(CACHE_TTL);
            }
            cartCacheRepository.save(cart);
            log.debug("Cart saved to cache for userId: {}", cart.getUserId());
        } catch (Exception e) {
            log.warn("Failed to save cart to cache for userId: {}", cart.getUserId(), e);
        }
    }

    /**
     * Delete cart from cache
     */
    public void deleteFromCache(String userId) {
        try {
            cartCacheRepository.deleteById(userId);
            log.debug("Cart deleted from cache for userId: {}", userId);
        } catch (Exception e) {
            log.warn("Failed to delete cart from cache for userId: {}", userId, e);
        }
    }

    /**
     * Check if cart exists in cache
     */
    public boolean existsInCache(String userId) {
        try {
            return cartCacheRepository.existsById(userId);
        } catch (Exception e) {
            log.warn("Failed to check cache existence for userId: {}", userId, e);
            return false;
        }
    }
}
