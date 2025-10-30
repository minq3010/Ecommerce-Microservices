package com.nnson128.product_service.service;

import com.nnson128.product_service.dto.ProductRequestDTO;
import com.nnson128.product_service.dto.ProductResponseDTO;
import com.nnson128.product_service.entity.Product;
import com.nnson128.product_service.entity.Category;
import com.nnson128.product_service.repository.ProductRepository;
import com.nnson128.product_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // Create Product
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice())
                .stock(request.getStock())
                .sku(request.getSku())
                .imageUrl(request.getImageUrl())
                .category(category)
                .status("ACTIVE")
                .build();

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

    // Get Product by ID
    public ProductResponseDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    // Get all products paginated
    public Page<ProductResponseDTO> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable).map(this::mapToDTO);
    }

    // Search by category
    public Page<ProductResponseDTO> getProductsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategory(category, pageable).map(this::mapToDTO);
    }

    // Search by name
    public Page<ProductResponseDTO> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable).map(this::mapToDTO);
    }

    // Get active products by category
    public Page<ProductResponseDTO> getActiveProductsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByStatusAndCategoryOrderByCreatedAtDesc("ACTIVE", category, pageable)
                .map(this::mapToDTO);
    }

    // Update Product
    public ProductResponseDTO updateProduct(String id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice());
        product.setStock(request.getStock());
        product.setSku(request.getSku());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        Product updated = productRepository.save(product);
        return mapToDTO(updated);
    }

    // Delete Product
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    // Decrease stock
    public void decreaseStock(String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setStock(product.getStock() - quantity);
        if (product.getStock() == 0) {
            product.setStatus("OUT_OF_STOCK");
        }
        productRepository.save(product);
    }

    // Increase stock
    public void increaseStock(String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStock(product.getStock() + quantity);
        if ("OUT_OF_STOCK".equals(product.getStatus())) {
            product.setStatus("ACTIVE");
        }
        productRepository.save(product);
    }

    // Check stock availability
    public boolean hasStock(String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return product.getStock() >= quantity && "ACTIVE".equals(product.getStatus());
    }

    // Update product rating
    public void updateRating(String productId, Double newRating, Integer newReviewCount) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setRating(newRating);
        product.setReviewCount(newReviewCount);
        productRepository.save(product);
    }

    private ProductResponseDTO mapToDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .stock(product.getStock())
                .sku(product.getSku())
                .imageUrl(product.getImageUrl())
                .category(mapCategoryToDTO(product.getCategory()))
                .status(product.getStatus())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private com.nnson128.product_service.dto.CategoryDTO mapCategoryToDTO(Category category) {
        return com.nnson128.product_service.dto.CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
