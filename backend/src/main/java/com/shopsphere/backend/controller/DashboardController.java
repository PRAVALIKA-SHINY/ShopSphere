package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse> admin() {
        return ResponseEntity.ok(ApiResponse.of(true, "Dashboard fetched", dashboardService.getAdminDashboard()));
    }

    @GetMapping("/employee")
    public ResponseEntity<ApiResponse> employee(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.of(true, "Dashboard fetched", dashboardService.getEmployeeDashboard(principal.getId())));
    }

    @GetMapping("/customer")
    public ResponseEntity<ApiResponse> customer(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.of(true, "Dashboard fetched", dashboardService.getCustomerDashboard(principal.getId())));
    }
}
