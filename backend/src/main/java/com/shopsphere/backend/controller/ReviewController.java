package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.ReviewDtos.ReviewRequest;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Add a review
    @PostMapping
    public ResponseEntity<ApiResponse> add(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Review added",
                        reviewService.addReview(
                                principal.getId(),
                                request.getProductId(),
                                request.getRating(),
                                request.getComment()
                        )
                )
        );
    }

    // Get reviews for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Reviews fetched",
                        reviewService.getByProduct(
                                productId,
                                PageRequest.of(
                                        page,
                                        size
                                )
                        )
                )
        );
    }

    // Delete a customer's review
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {

        reviewService.delete(
                id,
                principal.getId()
        );

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Review deleted"
                )
        );
    }
}