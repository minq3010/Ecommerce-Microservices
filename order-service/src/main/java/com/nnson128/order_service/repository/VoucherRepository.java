package com.nnson128.order_service.repository;

import com.nnson128.order_service.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByCode(String code);

    List<Voucher> findByStatus(String status);

    @Query("SELECT v FROM Voucher v WHERE v.startDate <= ?1 AND v.endDate >= ?1 AND v.status = 'ACTIVE'")
    List<Voucher> findActiveVouchers(LocalDateTime date);

    @Query("SELECT v FROM Voucher v WHERE v.startDate > ?1 AND v.status = 'ACTIVE'")
    List<Voucher> findScheduledVouchers(LocalDateTime date);
}
