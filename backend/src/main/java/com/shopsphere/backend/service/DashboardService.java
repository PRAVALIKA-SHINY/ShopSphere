package com.shopsphere.backend.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Object> getAdminDashboard();
    Map<String, Object> getEmployeeDashboard(Long employeeId);
    Map<String, Object> getCustomerDashboard(Long customerId);
}
