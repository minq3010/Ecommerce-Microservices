package com.nnson128.order_service.repository;

import com.nnson128.order_service.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUserId(String userId, Pageable pageable);
    List<Order> findByStatus(String status);
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status, Pageable pageable);
}
