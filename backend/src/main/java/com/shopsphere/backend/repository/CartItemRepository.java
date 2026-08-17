package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    // Find all cart items for a customer
    List<CartItem> findByCustomerId(
            Long customerId
    );

    // Find one product in the customer's cart
    Optional<CartItem> findByCustomerIdAndProductId(
            Long customerId,
            Long productId
    );

    // Delete the customer's complete cart
    void deleteByCustomerId(
            Long customerId
    );
}