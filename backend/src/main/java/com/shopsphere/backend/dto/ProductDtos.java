package com.shopsphere.backend.dto;

import com.shopsphere.backend.enums.ProductStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class ProductDtos {

    // Product request

    @Data
    public static class ProductRequest {

        private String code;

        @NotBlank(message = "Product name is required")
        private String name;

        private String description;

        @NotNull(message = "Price is required")
        @Min(
                value = 0,
                message = "Price cannot be negative"
        )
        private BigDecimal price;

        @Min(
                value = 0,
                message = "Discount cannot be negative"
        )
        @Max(
                value = 100,
                message = "Discount cannot be greater than 100"
        )
        private Double discount;

        @Min(
                value = 0,
                message = "Stock cannot be negative"
        )
        private Integer stock;

        private List<String> images;

        private String specifications;

        private ProductStatus status;

        private Long categoryId;

        private Long brandId;
    }


    // Stock update request

    @Data
    public static class StockUpdateRequest {

        @NotNull(message = "Stock is required")
        @Min(
                value = 0,
                message = "Stock cannot be negative"
        )
        private Integer stock;
    }


    // Discount update request

    @Data
    public static class DiscountUpdateRequest {

        @NotNull(message = "Discount is required")
        @Min(
                value = 0,
                message = "Discount cannot be negative"
        )
        @Max(
                value = 100,
                message = "Discount cannot be greater than 100"
        )
        private Double discount;
    }
}