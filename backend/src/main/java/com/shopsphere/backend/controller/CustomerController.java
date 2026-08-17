package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.AuthDtos.ChangePasswordRequest;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.of(true, "Profile fetched", customerService.getProfile(principal.getId())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@AuthenticationPrincipal UserPrincipal principal, @RequestBody User user) {
        return ResponseEntity.ok(ApiResponse.of(true, "Profile updated", customerService.updateProfile(principal.getId(), user)));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody ChangePasswordRequest request) {
        customerService.changePassword(principal.getId(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.of(true, "Password changed"));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse> delete(@AuthenticationPrincipal UserPrincipal principal) {
        customerService.delete(principal.getId());
        return ResponseEntity.ok(ApiResponse.of(true, "Account deleted"));
    }
}
