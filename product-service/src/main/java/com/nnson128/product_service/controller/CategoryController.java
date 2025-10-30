package com.nnson128.product_service.controller;

import com.nnson128.product_service.dto.ApiResponse;
import com.nnson128.product_service.dto.CategoryDTO;
import com.nnson128.product_service.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> data = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.<List<CategoryDTO>>builder()
                .success(true)
                .message("Get all categories successfully")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable String id) {
        CategoryDTO data = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.<CategoryDTO>builder()
                .success(true)
                .message("Get category successfully")
                .data(data)
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody CategoryDTO request) {
        CategoryDTO data = categoryService.createCategory(request);
        return ResponseEntity.ok(ApiResponse.<CategoryDTO>builder()
                .success(true)
                .message("Category created successfully")
                .data(data)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable String id,
            @RequestBody CategoryDTO request) {
        CategoryDTO data = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.<CategoryDTO>builder()
                .success(true)
                .message("Category updated successfully")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Category deleted successfully")
                .build());
    }
}
