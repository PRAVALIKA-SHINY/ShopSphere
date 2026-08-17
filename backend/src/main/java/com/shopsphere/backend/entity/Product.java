package com.shopsphere.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.shopsphere.backend.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    private String code;


    @Column(nullable = false)
    private String name;


    @Column(length = 2000)
    private String description;


    @Column(nullable = false)
    private BigDecimal price;


    @Builder.Default
    private Double discount = 0.0;


    @Builder.Default
    private Integer stock = 0;


    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(
                    name = "product_id"
            )
    )
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images =
            new ArrayList<>();


    @Column(length = 4000)
    private String specifications;


    // =========================================================
    // CATEGORY
    // =========================================================

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


    // =========================================================
    // BRAND
    // =========================================================

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;


    // =========================================================
    // CREATED BY
    // =========================================================

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;


    // =========================================================
    // STATUS
    // =========================================================

    @Builder.Default
    private Boolean active = true;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProductStatus status =
            ProductStatus.ACTIVE;


    // =========================================================
    // REVIEWS
    // =========================================================

    @Builder.Default
    private Double averageRating = 0.0;


    @Builder.Default
    private Integer reviewCount = 0;


    // =========================================================
    // DATES
    // =========================================================

    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();


    private LocalDateTime updatedAt;


    @PreUpdate
    public void preUpdate() {

        this.updatedAt =
                LocalDateTime.now();
    }
}