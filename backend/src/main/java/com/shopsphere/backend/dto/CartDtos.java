package com.shopsphere.backend.dto;

import com.shopsphere.backend.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDtos {

    @Data
    public static class AddToCartRequest {

        @NotNull
        private Long productId;

        private Integer quantity = 1;
    }

    @Data
    public static class UpdateQuantityRequest {

        @NotNull
        private Integer quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartResponse {

        @Builder.Default
        private List<CartItemResponse> items =
                new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {

        private Long id;

        private Integer quantity;

        private CartProductResponse product;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartProductResponse {

        private Long id;

        private String code;

        private String name;

        private String description;

        private BigDecimal price;

        private Double discount;

        private Integer stock;

        @Builder.Default
        private List<String> images =
                new ArrayList<>();

        private String specifications;

        private Long categoryId;

        private Long brandId;

        private Boolean active;

        private ProductStatus status;

        private Double averageRating;

        private Integer reviewCount;
    }
}