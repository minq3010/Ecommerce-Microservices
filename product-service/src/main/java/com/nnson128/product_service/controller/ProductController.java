package com.nnson128.product_service.controller;

import com.nnson128.product_service.dto.ApiResponse;
import com.nnson128.product_service.dto.ProductRequestDTO;
import com.nnson128.product_service.dto.ProductResponseDTO;
import com.nnson128.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductResponseDTO> data = productService.getAllProducts(page, size);
        return ResponseEntity.ok(ApiResponse.<Page<ProductResponseDTO>>builder()
                .success(true)
                .message("Get all products successfully")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable String id) {
        ProductResponseDTO data = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.<ProductResponseDTO>builder()
                .success(true)
                .message("Get product successfully")
                .data(data)
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductResponseDTO> data = productService.searchProducts(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.<Page<ProductResponseDTO>>builder()
                .success(true)
                .message("Search products successfully")
                .data(data)
                .build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductResponseDTO> data = productService.getActiveProductsByCategory(category, page, size);
        return ResponseEntity.ok(ApiResponse.<Page<ProductResponseDTO>>builder()
                .success(true)
                .message("Get products by category successfully")
                .data(data)
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(@RequestBody ProductRequestDTO request) {
        ProductResponseDTO data = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.<ProductResponseDTO>builder()
                .success(true)
                .message("Product created successfully")
                .data(data)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable String id,
            @RequestBody ProductRequestDTO request) {
        ProductResponseDTO data = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.<ProductResponseDTO>builder()
                .success(true)
                .message("Product updated successfully")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Product deleted successfully")
                .build());
    }

    @PostMapping("/{id}/decrease-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> decreaseStock(
            @PathVariable String id,
            @RequestParam int quantity) {
        productService.decreaseStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Stock decreased successfully")
                .build());
    }

    @PostMapping("/{id}/increase-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> increaseStock(
            @PathVariable String id,
            @RequestParam int quantity) {
        productService.increaseStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Stock increased successfully")
                .build());
    }

    @GetMapping("/{id}/check-stock")
    public ResponseEntity<ApiResponse<Boolean>> checkStock(
            @PathVariable String id,
            @RequestParam int quantity) {
        boolean hasStock = productService.hasStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .success(true)
                .message(hasStock ? "Stock available" : "Stock not available")
                .data(hasStock)
                .build());
    }
}
