package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.AuthDtos.EmployeeCreateRequest;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody EmployeeCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employee created", employeeService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<User> employees = employeeService.getAllPaged(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.of(true, "Employees fetched", employees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employee fetched", employeeService.getById(id)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employee fetched", employeeService.getByEmail(email)));
    }

    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<ApiResponse> getByMobile(@PathVariable String mobile) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employee fetched", employeeService.getByMobile(mobile)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employees fetched", employeeService.getByStatus(status)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employees fetched", employeeService.search(name, PageRequest.of(page, size))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(ApiResponse.of(true, "Employee updated", employeeService.update(id, user)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(ApiResponse.of(true, "Status updated", employeeService.updateStatus(id, status)));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<ApiResponse> updatePassword(@PathVariable Long id,
                                                        @RequestParam String oldPassword,
                                                        @RequestParam String newPassword) {
        employeeService.updatePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.of(true, "Password updated"));
    }

    @PatchMapping("/{id}/photo")
    public ResponseEntity<ApiResponse> updatePhoto(@PathVariable Long id, @RequestParam String photoUrl) {
        return ResponseEntity.ok(ApiResponse.of(true, "Photo updated", employeeService.updatePhoto(id, photoUrl)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.of(true, "Employee deleted"));
    }
}
