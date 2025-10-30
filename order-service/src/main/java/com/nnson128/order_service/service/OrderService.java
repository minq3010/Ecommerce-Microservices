package com.nnson128.order_service.service;

import com.nnson128.order_service.dto.CreateOrderRequestDTO;
import com.nnson128.order_service.dto.OrderItemDTO;
import com.nnson128.order_service.dto.OrderResponseDTO;
import com.nnson128.order_service.entity.Order;
import com.nnson128.order_service.entity.OrderItem;
import com.nnson128.order_service.repository.OrderItemRepository;
import com.nnson128.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // Create order
    public OrderResponseDTO createOrder(String userId, CreateOrderRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // Calculate total price
        BigDecimal totalPrice = request.getItems().stream()
                .map(OrderItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        totalPrice = totalPrice
                .add(request.getShippingCost() != null ? request.getShippingCost() : BigDecimal.ZERO)
                .add(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO);

        Order order = Order.builder()
                .userId(userId)
                .totalPrice(totalPrice)
                .shippingCost(request.getShippingCost() != null ? request.getShippingCost() : BigDecimal.ZERO)
                .taxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO)
                .status("PENDING")
                .shippingAddress(request.getShippingAddress())
                .phoneNumber(request.getPhoneNumber())
                .notes(request.getNotes())
                .paymentStatus("PENDING")
                .itemCount(request.getItems().size())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items
        for (OrderItemDTO itemDTO : request.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .productId(itemDTO.getProductId())
                    .productName(itemDTO.getProductName())
                    .price(itemDTO.getPrice())
                    .quantity(itemDTO.getQuantity())
                    .subtotal(itemDTO.getSubtotal())
                    .build();
            orderItemRepository.save(orderItem);
        }

        log.info("Order created with ID: {}", savedOrder.getId());
        return mapToDTO(savedOrder);
    }

    // Get order by ID
    public OrderResponseDTO getOrderById(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to this order");
        }

        return mapToDTO(order);
    }

    // Get user orders
    public Page<OrderResponseDTO> getUserOrders(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByUserId(userId, pageable).map(this::mapToDTO);
    }

    // Get all orders (admin)
    public Page<OrderResponseDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAll(pageable).map(this::mapToDTO);
    }

    // Update order status
    public OrderResponseDTO updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        order.setStatus(status);
        Order updated = orderRepository.save(order);
        log.info("Order {} status updated to {}", orderId, status);
        return mapToDTO(updated);
    }

    // Update payment status
    public OrderResponseDTO updatePaymentStatus(String orderId, String paymentStatus, String paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus(paymentStatus);
        order.setPaymentId(paymentId);
        
        if ("COMPLETED".equals(paymentStatus)) {
            order.setStatus("CONFIRMED");
        }

        Order updated = orderRepository.save(order);
        log.info("Order {} payment status updated to {}", orderId, paymentStatus);
        return mapToDTO(updated);
    }

    // Cancel order
    public OrderResponseDTO cancelOrder(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to this order");
        }

        if ("DELIVERED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel this order");
        }

        order.setStatus("CANCELLED");
        Order updated = orderRepository.save(order);
        log.info("Order {} cancelled", orderId);
        return mapToDTO(updated);
    }

    // Get orders by status (admin)
    public List<OrderResponseDTO> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private boolean isValidStatus(String status) {
        return status.matches("PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED");
    }

    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemDTO> itemDTOs = items.stream()
                .map(item -> OrderItemDTO.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalPrice(order.getTotalPrice())
                .shippingCost(order.getShippingCost())
                .taxAmount(order.getTaxAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .notes(order.getNotes())
                .paymentStatus(order.getPaymentStatus())
                .paymentId(order.getPaymentId())
                .itemCount(order.getItemCount())
                .items(itemDTOs)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
