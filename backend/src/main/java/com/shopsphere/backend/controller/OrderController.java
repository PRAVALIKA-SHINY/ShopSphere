package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.OrderDtos.OrderItemResponse;
import com.shopsphere.backend.dto.OrderDtos.OrderResponse;
import com.shopsphere.backend.dto.OrderDtos.PlaceOrderRequest;
import com.shopsphere.backend.dto.OrderDtos.UpdateOrderStatusRequest;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.enums.OrderStatus;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // =========================================================
    // PLACE ORDER
    // =========================================================

    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PlaceOrderRequest request
    ) {

        Order order =
                orderService.placeOrder(
                        principal.getId(),
                        request
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Order placed successfully",
                        toOrderResponse(order)
                )
        );
    }


    // =========================================================
    // GET CUSTOMER ORDERS
    // =========================================================

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse> myOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        // -----------------------------------------------------
        // Validate pagination values
        // -----------------------------------------------------

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        // Prevent unnecessarily large requests.
        if (size > 100) {
            size = 100;
        }


        var orders =
                orderService.getByCustomer(
                        principal.getId(),
                        PageRequest.of(page, size)
                );


        // The service has already initialized:
        //
        // customer
        // order items
        // products
        // product images
        //
        // while Hibernate session was active.

        var response =
                orders.map(
                        this::toOrderResponse
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Orders fetched",
                        response
                )
        );
    }


    // =========================================================
    // GET ONE CUSTOMER ORDER
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {

        Order order =
                orderService.getById(id);


        if (
                order.getCustomer() == null
                        ||
                        !order.getCustomer()
                                .getId()
                                .equals(principal.getId())
        ) {

            return ResponseEntity
                    .status(403)
                    .body(
                            ApiResponse.of(
                                    false,
                                    "You are not allowed to view this order"
                            )
                    );
        }


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Order fetched",
                        toOrderResponse(order)
                )
        );
    }


    // =========================================================
    // CANCEL CUSTOMER ORDER
    // =========================================================

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancel(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {

        Order order =
                orderService.cancelOrder(
                        id,
                        principal.getId()
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Order cancelled",
                        toOrderResponse(order)
                )
        );
    }


    // =========================================================
    // ADMIN / EMPLOYEE - GET ALL ORDERS
    // =========================================================

    @GetMapping("/admin/all")
    @PreAuthorize(
            "hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_EMPLOYEE')"
    )
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 100) {
            size = 100;
        }


        var orders =
                orderService.getAll(
                        PageRequest.of(page, size)
                );


        var response =
                orders.map(
                        this::toOrderResponse
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Orders fetched",
                        response
                )
        );
    }


    // =========================================================
    // ADMIN / EMPLOYEE - GET BY STATUS
    // =========================================================

    @GetMapping("/admin/status/{status}")
    @PreAuthorize(
            "hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_EMPLOYEE')"
    )
    public ResponseEntity<ApiResponse> getByStatus(
            @PathVariable OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 100) {
            size = 100;
        }


        var orders =
                orderService.getByStatus(
                        status,
                        PageRequest.of(page, size)
                );


        var response =
                orders.map(
                        this::toOrderResponse
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Orders fetched",
                        response
                )
        );
    }


    // =========================================================
    // ADMIN / EMPLOYEE - UPDATE ORDER STATUS
    // =========================================================

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize(
            "hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_EMPLOYEE')"
    )
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {

        if (
                request == null
                        ||
                        request.getStatus() == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ApiResponse.of(
                                    false,
                                    "Order status is required"
                            )
                    );
        }


        Order order =
                orderService.updateStatus(
                        id,
                        request.getStatus()
                );


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Order status updated",
                        toOrderResponse(order)
                )
        );
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private OrderResponse toOrderResponse(
            Order order
    ) {

        if (order == null) {
            return null;
        }


        // -----------------------------------------------------
        // CUSTOMER
        // -----------------------------------------------------

        Long customerId = null;

        String customerName = null;

        String customerEmail = null;


        if (order.getCustomer() != null) {

            customerId =
                    order.getCustomer().getId();

            customerName =
                    order.getCustomer().getName();

            customerEmail =
                    order.getCustomer().getEmail();
        }


        // -----------------------------------------------------
        // ORDER ITEMS
        // -----------------------------------------------------

        List<OrderItemResponse> itemResponses =
                order.getItems() == null
                        ? List.of()
                        :
                        order.getItems()
                                .stream()
                                .map(item -> {

                                    Long productId = null;

                                    String image = null;


                                    if (
                                            item != null
                                            &&
                                            item.getProduct() != null
                                    ) {

                                        productId =
                                                item.getProduct()
                                                        .getId();


                                        if (
                                                item.getProduct()
                                                        .getImages() != null
                                                &&
                                                !item.getProduct()
                                                        .getImages()
                                                        .isEmpty()
                                        ) {

                                            image =
                                                    item.getProduct()
                                                            .getImages()
                                                            .get(0);
                                        }
                                    }


                                    return OrderItemResponse
                                            .builder()
                                            .id(
                                                    item.getId()
                                            )
                                            .productId(
                                                    productId
                                            )
                                            .productName(
                                                    item.getProductName()
                                            )
                                            .quantity(
                                                    item.getQuantity()
                                            )
                                            .price(
                                                    item.getPrice()
                                            )
                                            .image(
                                                    image
                                            )
                                            .build();
                                })
                                .collect(
                                        Collectors.toList()
                                );


        // -----------------------------------------------------
        // RESPONSE
        // -----------------------------------------------------

        return OrderResponse
                .builder()
                .id(
                        order.getId()
                )
                .orderNumber(
                        order.getOrderNumber()
                )
                .customerId(
                        customerId
                )
                .customerName(
                        customerName
                )
                .customerEmail(
                        customerEmail
                )
                .items(
                        itemResponses
                )
                .totalAmount(
                        order.getTotalAmount()
                )
                .shippingAmount(
                        order.getShippingAmount()
                )
                .status(
                        order.getStatus()
                )
                .paymentStatus(
                        order.getPaymentStatus()
                )
                .paymentMethod(
                        order.getPaymentMethod()
                )
                .shippingAddress(
                        order.getShippingAddress()
                )
                .shippingCity(
                        order.getShippingCity()
                )
                .shippingState(
                        order.getShippingState()
                )
                .shippingPincode(
                        order.getShippingPincode()
                )
                .shippingMobile(
                        order.getShippingMobile()
                )
                .createdAt(
                        order.getCreatedAt()
                )
                .updatedAt(
                        order.getUpdatedAt()
                )
                .build();
    }
}