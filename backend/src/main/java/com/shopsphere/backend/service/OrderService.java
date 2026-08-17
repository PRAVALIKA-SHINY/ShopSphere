package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.OrderDtos.PlaceOrderRequest;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    // Place a new customer order
    Order placeOrder(
            Long customerId,
            PlaceOrderRequest request
    );

    // Get one order by ID
    Order getById(
            Long id
    );

    // Get orders belonging to a customer
    Page<Order> getByCustomer(
            Long customerId,
            Pageable pageable
    );

    // Get all orders
    Page<Order> getAll(
            Pageable pageable
    );

    // Get orders by status
    Page<Order> getByStatus(
            OrderStatus status,
            Pageable pageable
    );

    // Update order status
    Order updateStatus(
            Long id,
            OrderStatus status
    );

    // Cancel a customer's order
    Order cancelOrder(
            Long id,
            Long customerId
    );
}