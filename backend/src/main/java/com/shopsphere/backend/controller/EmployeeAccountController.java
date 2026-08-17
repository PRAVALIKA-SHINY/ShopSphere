package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee-account")
@RequiredArgsConstructor
public class EmployeeAccountController {
    private final UserRepository userRepository;

    @PatchMapping("/deactivate")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public ResponseEntity<ApiResponse> deactivate(@AuthenticationPrincipal UserPrincipal principal) {
        var employee = userRepository.findById(principal.getId()).orElseThrow();
        employee.setStatus(Status.INACTIVE);
        userRepository.save(employee);
        return ResponseEntity.ok(ApiResponse.of(true, "Employee account deactivated"));
    }
}
