package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.ReviewDtos.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {

    // Add a customer review.
    ReviewResponse addReview(
            Long customerId,
            Long productId,
            Integer rating,
            String comment
    );

    // Get all reviews belonging to a product.
    Page<ReviewResponse> getByProduct(
            Long productId,
            Pageable pageable
    );

    // Delete a customer's own review.
    void delete(
            Long id,
            Long customerId
    );
}