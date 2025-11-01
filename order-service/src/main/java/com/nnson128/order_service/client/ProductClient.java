package com.nnson128.order_service.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nnson128.order_service.dto.ProductResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${product.service.url:http://product-service:9001}")
    private String productServiceUrl;

    public ProductResponseDTO getProductById(String productId) {
        try {
            String url = productServiceUrl + "/api/v1/products/" + productId;
            log.debug("Calling Product Service: {}", url);
            
            // Get response as JsonNode to handle ApiResponse wrapper
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            
            if (response != null && response.get("success").asBoolean()) {
                JsonNode dataNode = response.get("data");
                if (dataNode != null) {
                    ProductResponseDTO product = objectMapper.treeToValue(dataNode, ProductResponseDTO.class);
                    log.debug("Product retrieved: {}", product);
                    return product;
                }
            }
            log.error("Invalid response from Product Service for productId: {}", productId);
            return null;
        } catch (Exception e) {
            log.error("Error calling Product Service for productId: {}", productId, e);
            throw new RuntimeException("Failed to get product details for productId: " + productId, e);
        }
    }
}
