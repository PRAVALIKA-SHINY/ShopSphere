package com.shopsphere.backend.dto;

import com.shopsphere.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 8)
        private String password;
        @NotBlank @Size(min = 8)
        private String confirmPassword;
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must contain exactly 10 digits")
        private String mobile;
        private String address;
        private String city;
        private String state;
        @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must contain exactly 6 digits")
        private String pincode;
    }

    @Data
    public static class EmployeeCreateRequest {
        @NotBlank
        private String name;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 8)
        private String password;
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must contain exactly 10 digits")
        private String mobile;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private Role role;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank @Email
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank
        private String token;
        @NotBlank @Size(min = 8)
        private String newPassword;
    }

    @Data
    @AllArgsConstructor
    public static class PasswordResetResponse {
        private String message;
        private String resetToken;
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank
        private String oldPassword;
        @NotBlank @Size(min = 6)
        private String newPassword;
    }
}
