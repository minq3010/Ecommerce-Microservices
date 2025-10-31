package com.nnson128.payment_service.repository;

import com.nnson128.payment_service.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    
    List<Payment> findByUserId(String userId);
    
    Page<Payment> findByUserId(String userId, Pageable pageable);
    
    List<Payment> findByStatus(String status);
    
    List<Payment> findByPaymentMethod(String paymentMethod);
}

