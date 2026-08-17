package com.shopsphere.backend.dto;

import com.shopsphere.backend.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class WishlistDtos {

    // Safe wishlist item returned to the frontend
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistItemResponse {

        private Long id;

        private Long productId;

        private String productCode;

        private String productName;

        private String description;

        private BigDecimal price;

        private Double discount;

        private Integer stock;

        private List<String> images;

        private ProductStatus status;

        private Boolean active;

        private Double averageRating;

        private Integer reviewCount;

        private LocalDateTime addedAt;
    }
}