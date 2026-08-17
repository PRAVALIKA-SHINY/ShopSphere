package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.enums.OrderStatus;
import com.shopsphere.backend.enums.PaymentMethod;
import com.shopsphere.backend.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // =========================================================
    // CUSTOMER ORDERS
    // =========================================================

    // Find customer orders using pagination.
    Page<Order> findByCustomerId(
            Long customerId,
            Pageable pageable
    );


    // =========================================================
    // ORDERS BY STATUS
    // =========================================================

    // Find orders by status using pagination.
    Page<Order> findByStatus(
            OrderStatus status,
            Pageable pageable
    );


    // =========================================================
    // FIND BY ORDER NUMBER
    // =========================================================

    // Load customer and items together.
    @EntityGraph(attributePaths = {
            "customer",
            "items"
    })
    Optional<Order> findByOrderNumber(
            String orderNumber
    );


    // =========================================================
    // FIND DETAILED ORDER
    // =========================================================

    // Load all data required when viewing one order.
    @EntityGraph(attributePaths = {
            "customer",
            "items"
    })
    @Query("""
            SELECT o
            FROM Order o
            WHERE o.id = :id
            """)
    Optional<Order> findDetailedById(
            @Param("id") Long id
    );


    // =========================================================
    // COUNT METHODS
    // =========================================================

    // Count orders by status.
    long countByStatus(
            OrderStatus status
    );


    // Count orders by payment status.
    long countByPaymentStatus(
            PaymentStatus paymentStatus
    );


    // Count orders by payment method.
    long countByPaymentMethod(
            PaymentMethod paymentMethod
    );


    // =========================================================
    // RECENT ORDERS
    // =========================================================



    @EntityGraph(attributePaths = {
            "customer",
            "items"
    })
    @Query("""
            SELECT o
            FROM Order o
            ORDER BY o.createdAt DESC
            """)
    Page<Order> findRecent(
            Pageable pageable
    );


    // =========================================================
    // ALL ORDERS WITH DETAILS
    // =========================================================


    @EntityGraph(attributePaths = {
            "customer",
            "items"
    })
    @Query("""
            SELECT o
            FROM Order o
            """)
    Page<Order> findAllWithDetails(
            Pageable pageable
    );
}