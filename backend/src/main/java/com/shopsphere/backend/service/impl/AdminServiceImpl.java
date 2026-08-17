package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.EmployeeResponse;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @Override
    public Page<EmployeeResponse> getEmployees(
            int page,
            int size
    ) {

        PageRequest pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );

        return userRepository
                .findByRole(
                        Role.EMPLOYEE,
                        pageable
                )
                .map(EmployeeResponse::from);
    }


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse createEmployee(
            User employee
    ) {

        if (
                employee.getEmail() == null ||
                        employee.getEmail().trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Employee email is required"
            );
        }

        if (
                userRepository
                        .findByEmail(employee.getEmail())
                        .isPresent()
        ) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        if (
                employee.getPassword() == null ||
                        employee.getPassword().length() < 8
        ) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters"
            );
        }

        employee.setId(null);

        employee.setRole(
                Role.EMPLOYEE
        );

        employee.setStatus(
                Status.ACTIVE
        );

        employee.setPassword(
                passwordEncoder.encode(
                        employee.getPassword()
                )
        );

        User saved =
                userRepository.save(employee);

        return EmployeeResponse.from(saved);
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse updateEmployee(
            Long id,
            User employee
    ) {

        User existing =
                userRepository.findById(id)
                        .filter(
                                user ->
                                        user.getRole()
                                                == Role.EMPLOYEE
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Employee not found"
                                        )
                        );

        if (employee.getName() != null) {
            existing.setName(
                    employee.getName()
            );
        }

        if (employee.getMobile() != null) {
            existing.setMobile(
                    employee.getMobile()
            );
        }

        if (employee.getAddress() != null) {
            existing.setAddress(
                    employee.getAddress()
            );
        }

        if (employee.getCity() != null) {
            existing.setCity(
                    employee.getCity()
            );
        }

        if (employee.getState() != null) {
            existing.setState(
                    employee.getState()
            );
        }

        if (employee.getPincode() != null) {
            existing.setPincode(
                    employee.getPincode()
            );
        }

        User saved =
                userRepository.save(existing);

        return EmployeeResponse.from(saved);
    }


    // =========================================================
    // UPDATE EMPLOYEE STATUS
    // =========================================================

    @Override
    public EmployeeResponse updateEmployeeStatus(
            Long id,
            String status
    ) {

        User employee =
                userRepository.findById(id)
                        .filter(
                                user ->
                                        user.getRole()
                                                == Role.EMPLOYEE
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Employee not found"
                                        )
                        );

        Status newStatus;

        try {
            newStatus =
                    Status.valueOf(
                            status.toUpperCase()
                    );
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Invalid employee status: " + status
            );
        }

        employee.setStatus(
                newStatus
        );

        User saved =
                userRepository.save(employee);

        return EmployeeResponse.from(saved);
    }


    // =========================================================
    // DEACTIVATE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse deactivateEmployee(
            Long id
    ) {

        User employee =
                userRepository.findById(id)
                        .filter(
                                user ->
                                        user.getRole()
                                                == Role.EMPLOYEE
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Employee not found"
                                        )
                        );

        employee.setStatus(
                Status.INACTIVE
        );

        User saved =
                userRepository.save(employee);

        return EmployeeResponse.from(saved);
    }
}