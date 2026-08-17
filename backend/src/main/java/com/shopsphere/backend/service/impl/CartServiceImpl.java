package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.CartDtos.CartItemResponse;
import com.shopsphere.backend.dto.CartDtos.CartProductResponse;
import com.shopsphere.backend.dto.CartDtos.CartResponse;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl
        implements CartService {

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponse addToCart(
            Long customerId,
            Long productId,
            Integer quantity
    ) {

        // Use quantity 1 when no quantity is supplied
        int requestedQuantity =
                quantity == null
                        ? 1
                        : quantity;

        if (requestedQuantity < 1) {
            throw new BadRequestException(
                    "Quantity must be at least 1"
            );
        }

        // Find customer
        User customer =
                userRepository.findById(customerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found"
                                )
                        );

        // Find product
        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        // Validate product
        validateProduct(product);

        // Validate requested stock
        if (product.getStock() == null
                || product.getStock() < requestedQuantity) {

            throw new BadRequestException(
                    "Product does not have enough stock"
            );
        }

        // Check whether product is already in cart
        cartItemRepository
                .findByCustomerIdAndProductId(
                        customerId,
                        productId
                )
                .ifPresentOrElse(
                        existingItem -> {

                            // Increase existing quantity
                            int nextQuantity =
                                    existingItem.getQuantity()
                                            + requestedQuantity;

                            if (nextQuantity > product.getStock()) {
                                throw new BadRequestException(
                                        "Quantity exceeds available stock"
                                );
                            }

                            existingItem.setQuantity(
                                    nextQuantity
                            );

                            cartItemRepository.save(
                                    existingItem
                            );
                        },
                        () -> {

                            // Create new cart item
                            CartItem newItem =
                                    CartItem.builder()
                                            .customer(customer)
                                            .product(product)
                                            .quantity(requestedQuantity)
                                            .build();

                            cartItemRepository.save(
                                    newItem
                            );
                        }
                );

        // Return updated cart
        return buildCart(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(
            Long customerId
    ) {

        // Verify customer
        userRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"
                        )
                );

        return buildCart(customerId);
    }

    @Override
    @Transactional
    public CartResponse updateQuantity(
            Long customerId,
            Long cartItemId,
            Integer quantity
    ) {

        // Validate quantity
        if (quantity == null || quantity < 1) {
            throw new BadRequestException(
                    "Quantity must be at least 1"
            );
        }

        // Find cart item
        CartItem item =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found"
                                )
                        );

        // Verify ownership
        if (item.getCustomer() == null
                || !item.getCustomer()
                .getId()
                .equals(customerId)) {

            throw new ResourceNotFoundException(
                    "Cart item not found"
            );
        }

        Product product =
                item.getProduct();

        // Validate product
        validateProduct(product);

        // Validate stock
        if (product.getStock() == null
                || quantity > product.getStock()) {

            throw new BadRequestException(
                    "Quantity exceeds available stock"
            );
        }

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return buildCart(customerId);
    }

    @Override
    @Transactional
    public CartResponse removeItem(
            Long customerId,
            Long cartItemId
    ) {

        // Find cart item
        CartItem item =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found"
                                )
                        );

        // Verify ownership
        if (item.getCustomer() == null
                || !item.getCustomer()
                .getId()
                .equals(customerId)) {

            throw new ResourceNotFoundException(
                    "Cart item not found"
            );
        }

        // Delete item
        cartItemRepository.delete(item);

        return buildCart(customerId);
    }

    @Override
    @Transactional
    public CartResponse clearCart(
            Long customerId
    ) {

        // Delete all cart items
        cartItemRepository.deleteByCustomerId(
                customerId
        );

        return CartResponse.builder()
                .items(new ArrayList<>())
                .build();
    }

    // Validate whether a product can be purchased
    private void validateProduct(
            Product product
    ) {

        if (product == null) {
            throw new ResourceNotFoundException(
                    "Product not found"
            );
        }

        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BadRequestException(
                    "Product is inactive"
            );
        }

        if (product.getStatus()
                == com.shopsphere.backend.enums.ProductStatus.INACTIVE
                || product.getStatus()
                == com.shopsphere.backend.enums.ProductStatus.DISCONTINUED) {

            throw new BadRequestException(
                    "Product is no longer available"
            );
        }

        if (product.getStock() == null
                || product.getStock() <= 0
                || product.getStatus()
                == com.shopsphere.backend.enums.ProductStatus.OUT_OF_STOCK) {

            throw new BadRequestException(
                    "Product is out of stock"
            );
        }
    }

    // Build a safe cart response
    private CartResponse buildCart(
            Long customerId
    ) {

        List<CartItem> cartItems =
                cartItemRepository.findByCustomerId(
                        customerId
                );

        List<CartItemResponse> responseItems =
                cartItems.stream()
                        .map(this::toCartItemResponse)
                        .toList();

        return CartResponse.builder()
                .items(responseItems)
                .build();
    }

    // Convert cart entity into a safe DTO
    private CartItemResponse toCartItemResponse(
            CartItem item
    ) {

        Product product =
                item.getProduct();

        if (product == null) {

            return CartItemResponse.builder()
                    .id(item.getId())
                    .quantity(item.getQuantity())
                    .product(null)
                    .build();
        }

        List<String> images =
                product.getImages() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                        product.getImages()
                );

        CartProductResponse productResponse =
                CartProductResponse.builder()
                        .id(product.getId())
                        .code(product.getCode())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .discount(product.getDiscount())
                        .stock(product.getStock())
                        .images(images)
                        .specifications(
                                product.getSpecifications()
                        )
                        .categoryId(
                                product.getCategory() == null
                                        ? null
                                        : product.getCategory().getId()
                        )
                        .brandId(
                                product.getBrand() == null
                                        ? null
                                        : product.getBrand().getId()
                        )
                        .active(product.getActive())
                        .status(product.getStatus())
                        .averageRating(
                                product.getAverageRating()
                        )
                        .reviewCount(
                                product.getReviewCount()
                        )
                        .build();

        return CartItemResponse.builder()
                .id(item.getId())
                .quantity(item.getQuantity())
                .product(productResponse)
                .build();
    }
}