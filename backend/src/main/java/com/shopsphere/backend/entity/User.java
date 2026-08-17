package com.shopsphere.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = "email"
                ),
                @UniqueConstraint(
                        columnNames = "mobile"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String email;


    @JsonIgnore
    @Column(nullable = false)
    private String password;


    private String mobile;

    private String photo;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status =
            Status.ACTIVE;


    private String address;

    private String city;

    private String state;

    private String pincode;


    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();


    private LocalDateTime updatedAt;


    @JsonIgnore
    private String passwordResetToken;


    @JsonIgnore
    private LocalDateTime passwordResetExpiresAt;


    @PreUpdate
    public void preUpdate() {

        this.updatedAt =
                LocalDateTime.now();
    }
}