package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.WishlistDtos.WishlistItemResponse;

import java.util.List;

public interface WishlistService {

    // Add a product to the wishlist
    WishlistItemResponse addToWishlist(
            Long customerId,
            Long productId
    );

    // Get all wishlist items
    List<WishlistItemResponse> getWishlist(
            Long customerId
    );

    // Remove a product from the wishlist
    void removeFromWishlist(
            Long customerId,
            Long productId
    );

    // Add or remove a product from the wishlist
    WishlistItemResponse toggleWishlist(
            Long customerId,
            Long productId
    );
}