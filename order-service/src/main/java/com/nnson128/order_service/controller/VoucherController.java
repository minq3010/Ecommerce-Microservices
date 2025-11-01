package com.nnson128.order_service.controller;

import com.nnson128.order_service.dto.ApiResponse;
import com.nnson128.order_service.dto.VoucherDTO;
import com.nnson128.order_service.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getAllVouchers() {
        try {
            List<VoucherDTO> vouchers = voucherService.getAllVouchers();
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(true)
                    .message("Vouchers fetched successfully")
                    .data(vouchers)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherDTO>> getVoucher(@PathVariable String id) {
        try {
            VoucherDTO voucher = voucherService.getVoucher(id);
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(true)
                    .message("Voucher fetched successfully")
                    .data(voucher)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<VoucherDTO>> getByCode(@PathVariable String code) {
        try {
            VoucherDTO voucher = voucherService.getByCode(code);
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(true)
                    .message("Voucher fetched successfully")
                    .data(voucher)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getByStatus(@PathVariable String status) {
        try {
            List<VoucherDTO> vouchers = voucherService.getByStatus(status);
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(true)
                    .message("Vouchers fetched successfully")
                    .data(vouchers)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getActiveVouchers() {
        try {
            List<VoucherDTO> vouchers = voucherService.getActiveVouchers();
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(true)
                    .message("Active vouchers fetched successfully")
                    .data(vouchers)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<List<VoucherDTO>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VoucherDTO>> createVoucher(@RequestBody VoucherDTO voucherDTO) {
        try {
            VoucherDTO created = voucherService.createVoucher(voucherDTO);
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(true)
                    .message("Voucher created successfully")
                    .data(created)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherDTO>> updateVoucher(
            @PathVariable String id,
            @RequestBody VoucherDTO voucherDTO) {
        try {
            VoucherDTO updated = voucherService.updateVoucher(id, voucherDTO);
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(true)
                    .message("Voucher updated successfully")
                    .data(updated)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<VoucherDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable String id) {
        try {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Voucher deleted successfully")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/{id}/increment-usage")
    public ResponseEntity<ApiResponse<Void>> incrementUsageCount(@PathVariable String id) {
        try {
            voucherService.incrementUsageCount(id);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Voucher usage count incremented")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }
}
