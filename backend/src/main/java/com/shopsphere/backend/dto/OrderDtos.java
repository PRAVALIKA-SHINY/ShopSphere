package com.shopsphere.backend.dto;

import com.shopsphere.backend.enums.OrderStatus;
import com.shopsphere.backend.enums.PaymentMethod;
import com.shopsphere.backend.enums.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDtos {

    // Request used when placing an order
    @Data
    public static class PlaceOrderRequest {

        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "Shipping city is required")
        private String shippingCity;

        @NotBlank(message = "Shipping state is required")
        private String shippingState;

        @NotBlank(message = "Shipping pincode is required")
        private String shippingPincode;

        @NotBlank(message = "Shipping mobile is required")
        private String shippingMobile;

        private PaymentMethod paymentMethod;

        // Mock payment reference
        private String paymentReference;

        // Kept for frontend compatibility
        private String cardNumber;

        private String cardExpiry;

        private String cardCvv;
    }

    // Request used to update order status
    @Data
    public static class UpdateOrderStatusRequest {

        private OrderStatus status;
    }

    // Safe response returned to the frontend
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponse {

        private Long id;

        private String orderNumber;

        private Long customerId;

        private String customerName;

        private String customerEmail;

        private List<OrderItemResponse> items;

        private BigDecimal totalAmount;

        private BigDecimal shippingAmount;

        private OrderStatus status;

        private PaymentStatus paymentStatus;

        private PaymentMethod paymentMethod;

        private String shippingAddress;

        private String shippingCity;

        private String shippingState;

        private String shippingPincode;

        private String shippingMobile;

        private LocalDateTime createdAt;

        private LocalDateTime updatedAt;
    }

    // Safe order-item response
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {

        private Long id;

        private Long productId;

        private String productName;

        private Integer quantity;

        private BigDecimal price;

        private String image;
    }
}