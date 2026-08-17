package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    // Load the customer together with reviews.
    //
    // This prevents the customer information from
    // becoming unavailable when the response is created.
    @EntityGraph(
            attributePaths = {
                    "customer"
            }
    )
    Page<Review> findByProductId(
            Long productId,
            Pageable pageable
    );


    // Load all reviews for recalculating
    // the product rating and review count.
    @EntityGraph(
            attributePaths = {
                    "customer"
            }
    )
    List<Review> findAllByProductId(
            Long productId
    );


    // Check whether a customer has already
    // reviewed a particular product.
    boolean existsByCustomerIdAndProductId(
            Long customerId,
            Long productId
    );
}