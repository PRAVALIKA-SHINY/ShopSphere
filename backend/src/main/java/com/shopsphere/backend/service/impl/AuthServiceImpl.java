package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.AuthDtos.*;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.security.JwtUtil;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() != Status.ACTIVE) {
            throw new BadRequestException(
                    user.getStatus() == Status.BLOCKED
                            ? "This account is blocked. Please contact the administrator."
                            : "This account is inactive. Please contact the administrator."
            );
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal, user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public AuthResponse registerCustomer(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already registered");
        }
        if (request.getMobile() != null && !request.getMobile().isBlank() && userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .role(Role.CUSTOMER)
                .status(Status.ACTIVE)
                .build();
        user = userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal, user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public PasswordResetResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase()).orElse(null);
        if (user == null) {
            return new PasswordResetResponse("If the account exists, a reset token has been generated.", null);
        }
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        return new PasswordResetResponse("Mock reset token generated. In production this would be emailed to the user.", token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (user.getPasswordResetExpiresAt() == null || user.getPasswordResetExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset token");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        userRepository.save(user);
    }

    @Override
    public AuthResponse createEmployee(EmployeeCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .role(Role.EMPLOYEE)
                .status(Status.ACTIVE)
                .build();
        user = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal, user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
