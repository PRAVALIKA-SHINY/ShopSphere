package com.shopsphere.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ReviewDtos {

    // Request used when a customer submits a review.
    @Data
    public static class ReviewRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Rating is required")
        @Min(
                value = 1,
                message = "Rating must be at least 1"
        )
        @Max(
                value = 5,
                message = "Rating cannot be greater than 5"
        )
        private Integer rating;

        private String comment;
    }


    // Safe response returned to the frontend.
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewResponse {

        private Long id;

        private Long productId;

        private Long customerId;

        private String customerName;

        private Integer rating;

        private String comment;

        private LocalDateTime createdAt;
    }
}