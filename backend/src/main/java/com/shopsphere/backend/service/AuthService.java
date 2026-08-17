package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.AuthDtos.*;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse registerCustomer(RegisterRequest request);
    AuthResponse createEmployee(EmployeeCreateRequest request);
    PasswordResetResponse forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
