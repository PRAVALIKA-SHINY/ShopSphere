package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.EmployeeResponse;
import com.shopsphere.backend.entity.User;
import org.springframework.data.domain.Page;

public interface AdminService {

    Page<EmployeeResponse> getEmployees(
            int page,
            int size
    );

    EmployeeResponse createEmployee(
            User employee
    );

    EmployeeResponse updateEmployee(
            Long id,
            User employee
    );

    EmployeeResponse updateEmployeeStatus(
            Long id,
            String status
    );

    EmployeeResponse deactivateEmployee(
            Long id
    );
}