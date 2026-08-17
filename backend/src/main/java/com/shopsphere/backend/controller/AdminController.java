package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // CUSTOMERS
    // =========================================================

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse> customers() {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Customers fetched",
                        userRepository.findByRole(Role.CUSTOMER)
                )
        );
    }


    @PatchMapping("/customers/{id}/status")
    public ResponseEntity<ApiResponse> updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam Status status
    ) {

        User customer = userRepository
                .findById(id)
                .filter(u -> u.getRole() == Role.CUSTOMER)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Customer not found"
                        )
                );

        customer.setStatus(status);

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Customer status updated",
                        userRepository.save(customer)
                )
        );
    }


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {

        List<User> allEmployees = userRepository
                .findByRole(Role.EMPLOYEE);

        int start = Math.min(
                page * size,
                allEmployees.size()
        );

        int end = Math.min(
                start + size,
                allEmployees.size()
        );

        List<User> pageContent =
                allEmployees.subList(start, end);

        Pageable pageable =
                PageRequest.of(page, size);

        Page<User> employeePage =
                new PageImpl<>(
                        pageContent,
                        pageable,
                        allEmployees.size()
                );

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Employees fetched",
                        employeePage
                )
        );
    }


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse> createEmployee(
            @RequestBody Map<String, String> request
    ) {

        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String mobile = request.get("mobile");


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (name == null || name.trim().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.of(
                            false,
                            "Employee name is required",
                            null
                    )
            );
        }

        if (email == null || email.trim().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.of(
                            false,
                            "Employee email is required",
                            null
                    )
            );
        }

        if (password == null || password.length() < 8) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.of(
                            false,
                            "Password must be at least 8 characters",
                            null
                    )
            );
        }


        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        boolean emailExists = userRepository
                .findByEmail(email.trim())
                .isPresent();

        if (emailExists) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.of(
                            false,
                            "An account with this email already exists",
                            null
                    )
            );
        }


        // -----------------------------------------------------
        // CREATE USER
        // -----------------------------------------------------

        User employee = new User();

        employee.setName(name.trim());
        employee.setEmail(email.trim().toLowerCase());

        employee.setPassword(
                passwordEncoder.encode(password)
        );

        employee.setMobile(
                mobile == null ? null : mobile.trim()
        );

        employee.setRole(Role.EMPLOYEE);
        employee.setStatus(Status.ACTIVE);


        User savedEmployee =
                userRepository.save(employee);


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Employee created successfully",
                        savedEmployee
                )
        );
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @PutMapping("/employees/{id}")
    public ResponseEntity<ApiResponse> updateEmployee(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        User employee = userRepository
                .findById(id)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Employee not found"
                        )
                );


        if (request.containsKey("name")) {

            employee.setName(
                    request.get("name")
            );
        }

        if (request.containsKey("mobile")) {

            employee.setMobile(
                    request.get("mobile")
            );
        }

        if (request.containsKey("address")) {

            employee.setAddress(
                    request.get("address")
            );
        }

        if (request.containsKey("city")) {

            employee.setCity(
                    request.get("city")
            );
        }

        if (request.containsKey("state")) {

            employee.setState(
                    request.get("state")
            );
        }

        if (request.containsKey("pincode")) {

            employee.setPincode(
                    request.get("pincode")
            );
        }


        User updatedEmployee =
                userRepository.save(employee);


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Employee details updated successfully",
                        updatedEmployee
                )
        );
    }


    // =========================================================
    // ACTIVATE / DEACTIVATE EMPLOYEE
    // =========================================================

    @PatchMapping("/employees/{id}/status")
    public ResponseEntity<ApiResponse> updateEmployeeStatus(
            @PathVariable Long id,
            @RequestParam Status status
    ) {

        User employee = userRepository
                .findById(id)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Employee not found"
                        )
                );


        employee.setStatus(status);

        User updatedEmployee =
                userRepository.save(employee);


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Employee status updated successfully",
                        updatedEmployee
                )
        );
    }


    // =========================================================
    // DELETE = DEACTIVATE
    // =========================================================

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(
            @PathVariable Long id
    ) {

        User employee = userRepository
                .findById(id)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Employee not found"
                        )
                );


        // We do NOT physically delete the employee.
        // We deactivate the account instead.

        employee.setStatus(Status.INACTIVE);

        User updatedEmployee =
                userRepository.save(employee);


        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Employee deactivated successfully",
                        updatedEmployee
                )
        );
    }
}