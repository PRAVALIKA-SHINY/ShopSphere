package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.enums.OrderStatus;
import com.shopsphere.backend.enums.PaymentMethod;
import com.shopsphere.backend.enums.PaymentStatus;
import com.shopsphere.backend.enums.ProductStatus;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.repository.BrandRepository;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;


    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @Override
    public Map<String, Object> getAdminDashboard() {

        Map<String, Object> data = new HashMap<>();

        // -----------------------------------------------------
        // USERS
        // -----------------------------------------------------

        data.put(
                "totalCustomers",
                userRepository.countByRole(Role.CUSTOMER)
        );

        data.put(
                "totalEmployees",
                userRepository.countByRole(Role.EMPLOYEE)
        );


        // -----------------------------------------------------
        // PRODUCTS
        // -----------------------------------------------------

        data.put(
                "totalProducts",
                productRepository.count()
        );

        data.put(
                "activeProducts",
                productRepository.countByActiveTrueAndStatusNotIn(
                        java.util.List.of(
                                ProductStatus.INACTIVE,
                                ProductStatus.DISCONTINUED
                        )
                )
        );

        data.put(
                "inactiveProducts",
                productRepository.countByStatus(ProductStatus.INACTIVE)
                        + productRepository.countByStatus(
                        ProductStatus.DISCONTINUED
                )
        );

        data.put(
                "lowStockProducts",
                productRepository.countLowStock(
                        java.util.List.of(
                                ProductStatus.INACTIVE,
                                ProductStatus.DISCONTINUED
                        ),
                        5
                )
        );


        // -----------------------------------------------------
        // REVENUE
        // -----------------------------------------------------

        BigDecimal revenue = orderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getPaymentStatus() == PaymentStatus.PAID
                                && order.getStatus() != OrderStatus.CANCELLED
                )
                .map(Order::getTotalAmount)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        data.put(
                "totalRevenue",
                revenue
        );


        // -----------------------------------------------------
        // PAYMENT INFORMATION
        // -----------------------------------------------------

        data.put(
                "paidOrders",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.PAID
                )
        );

        data.put(
                "codOrders",
                orderRepository.countByPaymentMethod(
                        PaymentMethod.COD
                )
        );

        data.put(
                "pendingPayments",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.PENDING
                )
        );

        data.put(
                "failedPayments",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.FAILED
                )
        );


        // -----------------------------------------------------
        // ORDER INFORMATION
        // -----------------------------------------------------

        data.put(
                "pendingOrders",
                orderRepository.countByStatus(OrderStatus.PLACED)
                        + orderRepository.countByStatus(OrderStatus.CONFIRMED)
                        + orderRepository.countByStatus(OrderStatus.PROCESSING)
        );

        data.put(
                "completedOrders",
                orderRepository.countByStatus(
                        OrderStatus.DELIVERED
                )
        );

        data.put(
                "totalOrders",
                orderRepository.count()
        );

        data.put(
                "placedOrders",
                orderRepository.countByStatus(
                        OrderStatus.PLACED
                )
        );

        data.put(
                "deliveredOrders",
                orderRepository.countByStatus(
                        OrderStatus.DELIVERED
                )
        );

        data.put(
                "cancelledOrders",
                orderRepository.countByStatus(
                        OrderStatus.CANCELLED
                )
        );


        // -----------------------------------------------------
        // CATEGORIES / BRANDS
        // -----------------------------------------------------

        data.put(
                "totalCategories",
                categoryRepository.count()
        );

        data.put(
                "totalBrands",
                brandRepository.count()
        );


        // -----------------------------------------------------
        // RECENT ORDERS
        // -----------------------------------------------------

        Page<Order> recentOrdersPage =
                orderRepository.findRecent(
                        PageRequest.of(0, 5)
                );

        data.put(
                "recentOrders",
                recentOrdersPage.getContent()
        );

        return data;
    }


    // =========================================================
    // EMPLOYEE DASHBOARD
    // =========================================================

    @Override
    public Map<String, Object> getEmployeeDashboard(
            Long employeeId
    ) {

        Map<String, Object> data = new HashMap<>();


        // -----------------------------------------------------
        // EMPLOYEE NAME
        // -----------------------------------------------------

        userRepository.findById(employeeId)
                .ifPresent(
                        employee ->
                                data.put(
                                        "employeeName",
                                        employee.getName()
                                )
                );


        // -----------------------------------------------------
        // PRODUCTS
        // -----------------------------------------------------

        data.put(
                "totalProducts",
                productRepository.count()
        );

        Page<com.shopsphere.backend.entity.Product> myProductsPage =
                productRepository.findByCreatedById(
                        employeeId,
                        PageRequest.of(0, 100)
                );

        data.put(
                "myProducts",
                myProductsPage.getTotalElements()
        );

        data.put(
                "activeProducts",
                productRepository.countByActiveTrueAndStatusNotIn(
                        java.util.List.of(
                                ProductStatus.INACTIVE,
                                ProductStatus.DISCONTINUED
                        )
                )
        );

        data.put(
                "lowStockProducts",
                productRepository.countLowStock(
                        java.util.List.of(
                                ProductStatus.INACTIVE,
                                ProductStatus.DISCONTINUED
                        ),
                        5
                )
        );


        // -----------------------------------------------------
        // ORDERS
        // -----------------------------------------------------

        data.put(
                "totalOrders",
                orderRepository.count()
        );

        data.put(
                "placedOrders",
                orderRepository.countByStatus(
                        OrderStatus.PLACED
                )
        );

        data.put(
                "deliveredOrders",
                orderRepository.countByStatus(
                        OrderStatus.DELIVERED
                )
        );


        // -----------------------------------------------------
        // PAYMENTS
        // -----------------------------------------------------

        data.put(
                "paidOrders",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.PAID
                )
        );

        data.put(
                "codOrders",
                orderRepository.countByPaymentMethod(
                        PaymentMethod.COD
                )
        );

        data.put(
                "pendingPayments",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.PENDING
                )
        );

        data.put(
                "failedPayments",
                orderRepository.countByPaymentStatus(
                        PaymentStatus.FAILED
                )
        );


        // -----------------------------------------------------
        // EMPLOYEE REVENUE
        // -----------------------------------------------------

        BigDecimal paidRevenue = orderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getPaymentStatus() == PaymentStatus.PAID
                                && order.getStatus() != OrderStatus.CANCELLED
                )
                .map(Order::getTotalAmount)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        data.put(
                "paidRevenue",
                paidRevenue
        );

        data.put(
                "totalRevenue",
                paidRevenue
        );


        // -----------------------------------------------------
        // RECENT ORDERS
        // -----------------------------------------------------

        Page<Order> recentOrdersPage =
                orderRepository.findRecent(
                        PageRequest.of(0, 8)
                );

        data.put(
                "recentOrders",
                recentOrdersPage.getContent()
        );

        return data;
    }


    // =========================================================
    // CUSTOMER DASHBOARD
    // =========================================================

    @Override
    public Map<String, Object> getCustomerDashboard(
            Long customerId
    ) {

        Map<String, Object> data = new HashMap<>();


        // -----------------------------------------------------
        // CUSTOMER ORDER COUNT
        // -----------------------------------------------------

        Page<Order> customerOrdersPage =
                orderRepository.findByCustomerId(
                        customerId,
                        PageRequest.of(0, 100)
                );

        data.put(
                "myOrders",
                customerOrdersPage.getTotalElements()
        );


        // -----------------------------------------------------
        // CUSTOMER RECENT ORDERS
        // -----------------------------------------------------

        Page<Order> recentCustomerOrdersPage =
                orderRepository.findByCustomerId(
                        customerId,
                        PageRequest.of(
                                0,
                                5,
                                Sort.by(
                                        Sort.Direction.DESC,
                                        "createdAt"
                                )
                        )
                );

        data.put(
                "recentOrders",
                recentCustomerOrdersPage.getContent()
        );

        return data;
    }
}