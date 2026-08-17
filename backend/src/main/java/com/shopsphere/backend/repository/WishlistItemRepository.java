package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository
        extends JpaRepository<WishlistItem, Long> {

    // Load product together with wishlist items
    @EntityGraph(attributePaths = {"product"})
    List<WishlistItem> findByCustomerId(Long customerId);

    // Find a specific product in the customer's wishlist
    @EntityGraph(attributePaths = {"product"})
    Optional<WishlistItem> findByCustomerIdAndProductId(
            Long customerId,
            Long productId
    );

    // Remove a specific product from the wishlist
    void deleteByCustomerIdAndProductId(
            Long customerId,
            Long productId
    );
}