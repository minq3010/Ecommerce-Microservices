package com.nnson128.payment_service.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nnson128.payment_service.dto.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${order.service.url:http://order-service:9003}")
    private String orderServiceUrl;

    public OrderResponseDTO getOrderById(String orderId) {
        try {
            String url = orderServiceUrl + "/api/v1/orders/" + orderId;
            log.debug("Calling Order Service: {}", url);
            
            // Get response as JsonNode to handle ApiResponse wrapper
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            
            if (response != null && response.get("success").asBoolean()) {
                JsonNode dataNode = response.get("data");
                if (dataNode != null) {
                    OrderResponseDTO order = objectMapper.treeToValue(dataNode, OrderResponseDTO.class);
                    log.debug("Order retrieved: {}", order);
                    return order;
                }
            }
            log.error("Invalid response from Order Service for orderId: {}", orderId);
            return null;
        } catch (Exception e) {
            log.error("Error calling Order Service for orderId: {}", orderId, e);
            throw new RuntimeException("Failed to get order details for orderId: " + orderId, e);
        }
    }
}

