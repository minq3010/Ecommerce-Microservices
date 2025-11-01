package com.nnson128.payment_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CREDIT_CARD|DEBIT_CARD|BANK_TRANSFER|E_WALLET", 
             message = "Payment method must be one of: CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, E_WALLET")
    private String paymentMethod;
}
