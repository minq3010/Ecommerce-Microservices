package com.nnson128.order_service.service;

import com.nnson128.order_service.dto.VoucherDTO;
import com.nnson128.order_service.entity.Voucher;
import com.nnson128.order_service.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherDTO createVoucher(VoucherDTO voucherDTO) {
        Voucher voucher = Voucher.builder()
                .code(voucherDTO.getCode())
                .description(voucherDTO.getDescription())
                .discountType(voucherDTO.getDiscountType())
                .discountValue(voucherDTO.getDiscountValue())
                .minPurchase(voucherDTO.getMinPurchase())
                .maxDiscount(voucherDTO.getMaxDiscount())
                .usageLimit(voucherDTO.getUsageLimit())
                .usageCount(0)
                .startDate(voucherDTO.getStartDate())
                .endDate(voucherDTO.getEndDate())
                .status("ACTIVE")
                .build();
        
        Voucher saved = voucherRepository.save(voucher);
        return mapToDTO(saved);
    }

    public VoucherDTO updateVoucher(String id, VoucherDTO voucherDTO) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        
        voucher.setCode(voucherDTO.getCode());
        voucher.setDescription(voucherDTO.getDescription());
        voucher.setDiscountType(voucherDTO.getDiscountType());
        voucher.setDiscountValue(voucherDTO.getDiscountValue());
        voucher.setMinPurchase(voucherDTO.getMinPurchase());
        voucher.setMaxDiscount(voucherDTO.getMaxDiscount());
        voucher.setUsageLimit(voucherDTO.getUsageLimit());
        voucher.setStartDate(voucherDTO.getStartDate());
        voucher.setEndDate(voucherDTO.getEndDate());
        voucher.setStatus(voucherDTO.getStatus());
        
        Voucher updated = voucherRepository.save(voucher);
        return mapToDTO(updated);
    }

    public void deleteVoucher(String id) {
        voucherRepository.deleteById(id);
    }

    public VoucherDTO getVoucher(String id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        return mapToDTO(voucher);
    }

    public List<VoucherDTO> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public VoucherDTO getByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        return mapToDTO(voucher);
    }

    public List<VoucherDTO> getActiveVouchers() {
        return voucherRepository.findActiveVouchers(LocalDateTime.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<VoucherDTO> getByStatus(String status) {
        return voucherRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void incrementUsageCount(String voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.setUsageCount(voucher.getUsageCount() + 1);
        
        // Update status if usage limit reached
        if (voucher.getUsageCount() >= voucher.getUsageLimit()) {
            voucher.setStatus("INACTIVE");
        }
        voucherRepository.save(voucher);
    }

    private VoucherDTO mapToDTO(Voucher voucher) {
        return VoucherDTO.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .minPurchase(voucher.getMinPurchase())
                .maxDiscount(voucher.getMaxDiscount())
                .usageLimit(voucher.getUsageLimit())
                .usageCount(voucher.getUsageCount())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .status(voucher.getStatus())
                .createdAt(voucher.getCreatedAt())
                .updatedAt(voucher.getUpdatedAt())
                .createdBy(voucher.getCreatedBy())
                .updatedBy(voucher.getUpdatedBy())
                .build();
    }
}
