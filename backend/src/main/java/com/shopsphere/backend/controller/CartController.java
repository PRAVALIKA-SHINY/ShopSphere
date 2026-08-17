package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.CartDtos.AddToCartRequest;
import com.shopsphere.backend.dto.CartDtos.UpdateQuantityRequest;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<ApiResponse> add(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddToCartRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Added to cart",
                        cartService.addToCart(
                                principal.getId(),
                                request.getProductId(),
                                request.getQuantity()
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getCart(
            @AuthenticationPrincipal UserPrincipal principal
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Cart fetched",
                        cartService.getCart(
                                principal.getId()
                        )
                )
        );
    }

    @PatchMapping("/{itemId}")
    public ResponseEntity<ApiResponse> updateQuantity(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateQuantityRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Quantity updated",
                        cartService.updateQuantity(
                                principal.getId(),
                                itemId,
                                request.getQuantity()
                        )
                )
        );
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse> remove(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Item removed",
                        cartService.removeItem(
                                principal.getId(),
                                itemId
                        )
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> clear(
            @AuthenticationPrincipal UserPrincipal principal
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Cart cleared",
                        cartService.clearCart(
                                principal.getId()
                        )
                )
        );
    }
}