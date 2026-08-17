package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // Add a product to the wishlist
    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse> add(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Added to wishlist",
                        wishlistService.addToWishlist(
                                principal.getId(),
                                productId
                        )
                )
        );
    }

    // Get the customer's wishlist
    @GetMapping
    public ResponseEntity<ApiResponse> getWishlist(
            @AuthenticationPrincipal UserPrincipal principal
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Wishlist fetched",
                        wishlistService.getWishlist(
                                principal.getId()
                        )
                )
        );
    }

    // Remove a product from the wishlist
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse> remove(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId
    ) {

        wishlistService.removeFromWishlist(
                principal.getId(),
                productId
        );

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Removed from wishlist"
                )
        );
    }

    // Toggle a product in the wishlist
    @PostMapping("/{productId}/toggle")
    public ResponseEntity<ApiResponse> toggle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId
    ) {

        var result =
                wishlistService.toggleWishlist(
                        principal.getId(),
                        productId
                );

        if (result == null) {

            return ResponseEntity.ok(
                    ApiResponse.of(
                            true,
                            "Removed from wishlist"
                    )
            );
        }

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Added to wishlist",
                        result
                )
        );
    }
}