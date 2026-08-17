package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.AuthDtos.EmployeeCreateRequest;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {
    User create(EmployeeCreateRequest request);
    List<User> getAll();
    Page<User> getAllPaged(Pageable pageable);
    User getById(Long id);
    User getByEmail(String email);
    User getByMobile(String mobile);
    List<User> getByStatus(Status status);
    Page<User> search(String name, Pageable pageable);
    User update(Long id, User updated);
    User updateStatus(Long id, Status status);
    User updatePassword(Long id, String oldPassword, String newPassword);
    User updatePhoto(Long id, String photoUrl);
    void delete(Long id);
}
