package com.nnson128.cart_service.repository;

import com.nnson128.cart_service.model.CartCache;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartCacheRepository extends CrudRepository<CartCache, String> {
    Optional<CartCache> findByUserId(String userId);
}
