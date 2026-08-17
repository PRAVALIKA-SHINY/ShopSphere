package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.AuthDtos.EmployeeCreateRequest;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User create(EmployeeCreateRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }
        if (request.getMobile() != null && !request.getMobile().isBlank() && userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
        User employee = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .role(Role.EMPLOYEE)
                .status(Status.ACTIVE)
                .build();
        return userRepository.save(employee);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findByRole(Role.EMPLOYEE);
    }

    @Override
    public Page<User> getAllPaged(Pageable pageable) {
        return userRepository.findByRole(Role.EMPLOYEE, pageable);
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
    }

    @Override
    public User getByMobile(String mobile) {
        return userRepository.findByMobile(mobile)
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with mobile: " + mobile));
    }

    @Override
    public List<User> getByStatus(Status status) {
        return userRepository.findByStatus(status).stream()
                .filter(u -> u.getRole() == Role.EMPLOYEE).toList();
    }

    @Override
    public Page<User> search(String name, Pageable pageable) {
        return userRepository.findByRoleAndNameContainingIgnoreCase(Role.EMPLOYEE, name, pageable);
    }

    @Override
    public User update(Long id, User updated) {
        User employee = getById(id);
        employee.setName(updated.getName());
        if (updated.getMobile() != null && !updated.getMobile().isBlank()
                && !updated.getMobile().equals(employee.getMobile())
                && userRepository.existsByMobile(updated.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
        employee.setMobile(updated.getMobile());
        employee.setAddress(updated.getAddress());
        employee.setCity(updated.getCity());
        employee.setState(updated.getState());
        employee.setPincode(updated.getPincode());
        return userRepository.save(employee);
    }

    @Override
    public User updateStatus(Long id, Status status) {
        User employee = getById(id);
        employee.setStatus(status);
        return userRepository.save(employee);
    }

    @Override
    public User updatePassword(Long id, String oldPassword, String newPassword) {
        User employee = getById(id);
        if (!passwordEncoder.matches(oldPassword, employee.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }
        employee.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(employee);
    }

    @Override
    public User updatePhoto(Long id, String photoUrl) {
        User employee = getById(id);
        employee.setPhoto(photoUrl);
        return userRepository.save(employee);
    }

    @Override
    public void delete(Long id) {
        User employee = getById(id);
        employee.setStatus(Status.INACTIVE);
        userRepository.save(employee);
    }
}
