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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String code;

    private String name;

    private String description;

    private BigDecimal price;

    private Double discount;

    private Integer stock;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    private String specifications;

    /*
     * We return IDs instead of JPA Category/Brand/User objects.
     * This prevents lazy-loading problems.
     */

    private Long categoryId;

    private Long brandId;

    private Long createdById;

    private Boolean active;

    private ProductStatus status;

    private Double averageRating;

    private Integer reviewCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}