package com.shopsphere.backend.dto;

import com.shopsphere.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String status;
    private String role;

    public static EmployeeResponse from(User user) {

        return new EmployeeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getMobile(),
                user.getAddress(),
                user.getCity(),
                user.getState(),
                user.getPincode(),
                user.getStatus() != null
                        ? user.getStatus().name()
                        : null,
                user.getRole() != null
                        ? user.getRole().name()
                        : null
        );
    }
}