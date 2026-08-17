package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.CartDtos.CartResponse;

public interface CartService {

    // Add a product to the cart
    CartResponse addToCart(
            Long customerId,
            Long productId,
            Integer quantity
    );

    // Get the customer's cart
    CartResponse getCart(
            Long customerId
    );

    // Update cart quantity
    CartResponse updateQuantity(
            Long customerId,
            Long cartItemId,
            Integer quantity
    );

    // Remove one cart item
    CartResponse removeItem(
            Long customerId,
            Long cartItemId
    );

    // Clear the entire cart
    CartResponse clearCart(
            Long customerId
    );
}