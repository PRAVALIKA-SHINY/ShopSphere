package com.shopsphere.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Customer who submitted the review.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;


    // Product being reviewed.
    //
    // Product is not serialized directly because
    // the API returns ReviewResponse instead.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id",
            nullable = false
    )
    private Product product;


    // Rating from 1 to 5.
    @Column(nullable = false)
    private Integer rating;


    // Optional customer comment.
    @Column(length = 1000)
    private String comment;


    // Review creation timestamp.
    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();
}