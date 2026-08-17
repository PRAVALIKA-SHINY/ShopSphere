package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.WishlistDtos.WishlistItemResponse;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.WishlistItem;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.repository.WishlistItemRepository;
import com.shopsphere.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl
        implements WishlistService {

    private final WishlistItemRepository wishlistItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    // Add a product to the wishlist
    @Override
    @Transactional
    public WishlistItemResponse addToWishlist(
            Long customerId,
            Long productId
    ) {

        WishlistItem existingItem =
                wishlistItemRepository
                        .findByCustomerIdAndProductId(
                                customerId,
                                productId
                        )
                        .orElse(null);

        if (existingItem != null) {
            return toResponse(existingItem);
        }

        Product product =
                productRepository.findById(
                        productId
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        User customer =
                userRepository.findById(
                        customerId
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"
                        )
                );

        WishlistItem wishlistItem =
                WishlistItem.builder()
                        .customer(customer)
                        .product(product)
                        .build();

        WishlistItem savedItem =
                wishlistItemRepository.save(
                        wishlistItem
                );

        return toResponse(savedItem);
    }

    // Get all wishlist items for the customer
    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist(
            Long customerId
    ) {

        userRepository.findById(
                customerId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Customer not found"
                )
        );

        List<WishlistItem> items =
                wishlistItemRepository
                        .findByCustomerId(
                                customerId
                        );

        return items
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Remove a product from the wishlist
    @Override
    @Transactional
    public void removeFromWishlist(
            Long customerId,
            Long productId
    ) {

        wishlistItemRepository
                .deleteByCustomerIdAndProductId(
                        customerId,
                        productId
                );
    }

    // Toggle wishlist state
    @Override
    @Transactional
    public WishlistItemResponse toggleWishlist(
            Long customerId,
            Long productId
    ) {

        WishlistItem existingItem =
                wishlistItemRepository
                        .findByCustomerIdAndProductId(
                                customerId,
                                productId
                        )
                        .orElse(null);

        if (existingItem != null) {

            wishlistItemRepository.delete(
                    existingItem
            );

            return null;
        }

        return addToWishlist(
                customerId,
                productId
        );
    }

    // Convert the entity into a JSON-safe DTO
    private WishlistItemResponse toResponse(
            WishlistItem item
    ) {

        if (item == null) {
            return null;
        }

        Product product =
                item.getProduct();

        if (product == null) {

            return WishlistItemResponse
                    .builder()
                    .id(item.getId())
                    .addedAt(item.getAddedAt())
                    .images(new ArrayList<>())
                    .build();
        }

        List<String> images =
                product.getImages() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                        product.getImages()
                );

        return WishlistItemResponse
                .builder()
                .id(item.getId())
                .productId(product.getId())
                .productCode(product.getCode())
                .productName(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .stock(product.getStock())
                .images(images)
                .status(product.getStatus())
                .active(product.getActive())
                .averageRating(
                        product.getAverageRating()
                )
                .reviewCount(
                        product.getReviewCount()
                )
                .addedAt(item.getAddedAt())
                .build();
    }
}