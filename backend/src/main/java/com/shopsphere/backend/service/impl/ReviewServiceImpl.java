package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.ReviewDtos.ReviewResponse;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Review;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.ReviewRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;


    // Add review
    @Override
    @Transactional
    public ReviewResponse addReview(
            Long customerId,
            Long productId,
            Integer rating,
            String comment
    ) {

        // Validate customer ID.
        if (customerId == null) {
            throw new BadRequestException(
                    "Customer ID is required"
            );
        }

        // Validate product ID.
        if (productId == null) {
            throw new BadRequestException(
                    "Product ID is required"
            );
        }

        // Validate rating.
        if (rating == null) {
            throw new BadRequestException(
                    "Rating is required"
            );
        }

        if (rating < 1 || rating > 5) {
            throw new BadRequestException(
                    "Rating must be between 1 and 5"
            );
        }

        // Prevent the same customer from reviewing
        // the same product more than once.
        if (
                reviewRepository
                        .existsByCustomerIdAndProductId(
                                customerId,
                                productId
                        )
        ) {
            throw new BadRequestException(
                    "You have already reviewed this product"
            );
        }

        // Find the product.
        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        // Find the customer.
        User customer =
                userRepository
                        .findById(customerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found"
                                )
                        );

        // Clean the comment before saving.
        String cleanComment = comment;

        if (cleanComment != null) {
            cleanComment = cleanComment.trim();

            if (cleanComment.isEmpty()) {
                cleanComment = null;
            }
        }

        // Create the review entity.
        Review review =
                Review.builder()
                        .customer(customer)
                        .product(product)
                        .rating(rating)
                        .comment(cleanComment)
                        .build();

        // Save the review.
        Review savedReview =
                reviewRepository.save(review);

        // Get all reviews so the product's
        // average rating can be recalculated.
        List<Review> allReviews =
                reviewRepository
                        .findAllByProductId(productId);

        // Calculate average rating.
        double average =
                allReviews
                        .stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);

        // Store rating rounded to one decimal place.
        product.setAverageRating(
                Math.round(average * 10.0) / 10.0
        );

        // Update total review count.
        product.setReviewCount(
                allReviews.size()
        );

        // Save updated product.
        productRepository.save(product);

        // Convert entity to DTO while the transaction
        // is still active.
        return toResponse(savedReview);
    }


    // Get product reviews
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getByProduct(
            Long productId,
            Pageable pageable
    ) {

        if (productId == null) {
            throw new BadRequestException(
                    "Product ID is required"
            );
        }

        // The repository returns Page<Review>.
        //
        // The service contract requires
        // Page<ReviewResponse>.
        //
        // Page.map() performs the conversion
        // without changing pagination information.
        Page<Review> reviews =
                reviewRepository
                        .findByProductId(
                                productId,
                                pageable
                        );

        return reviews.map(
                this::toResponse
        );
    }


    // Delete customer's own review
    @Override
    @Transactional
    public void delete(
            Long id,
            Long customerId
    ) {

        if (id == null) {
            throw new BadRequestException(
                    "Review ID is required"
            );
        }

        if (customerId == null) {
            throw new BadRequestException(
                    "Customer ID is required"
            );
        }

        // Find review.
        Review review =
                reviewRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        // Make sure the logged-in customer owns
        // this review.
        if (
                review.getCustomer() == null
                        || review
                        .getCustomer()
                        .getId() == null
                        || !review
                        .getCustomer()
                        .getId()
                        .equals(customerId)
        ) {
            throw new BadRequestException(
                    "You cannot delete this review"
            );
        }

        // Store the product before deleting
        // the review.
        Product product =
                review.getProduct();

        if (product == null) {
            throw new BadRequestException(
                    "Product associated with this review was not found"
            );
        }

        Long productId =
                product.getId();

        // Delete review.
        reviewRepository.delete(review);

        // Flush deletion so the following query
        // sees the updated review list.
        reviewRepository.flush();

        // Recalculate product rating and count.
        List<Review> remainingReviews =
                reviewRepository
                        .findAllByProductId(productId);

        double average =
                remainingReviews
                        .stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);

        product.setAverageRating(
                Math.round(average * 10.0) / 10.0
        );

        product.setReviewCount(
                remainingReviews.size()
        );

        productRepository.save(product);
    }


    // Convert Review entity into the safe
    // customer-facing ReviewResponse DTO.
    private ReviewResponse toResponse(
            Review review
    ) {

        if (review == null) {
            return null;
        }

        Long productId = null;
        Long customerId = null;
        String customerName = null;

        if (review.getProduct() != null) {
            productId =
                    review
                            .getProduct()
                            .getId();
        }

        if (review.getCustomer() != null) {
            customerId =
                    review
                            .getCustomer()
                            .getId();

            customerName =
                    review
                            .getCustomer()
                            .getName();
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .productId(productId)
                .customerId(customerId)
                .customerName(customerName)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}