package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User findCustomer(Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public User getProfile(Long id) {
        return findCustomer(id);
    }

    @Override
    public User updateProfile(Long id, User updated) {
        User customer = findCustomer(id);
        customer.setName(updated.getName());
        customer.setMobile(updated.getMobile());
        customer.setAddress(updated.getAddress());
        customer.setCity(updated.getCity());
        customer.setState(updated.getState());
        customer.setPincode(updated.getPincode());
        return userRepository.save(customer);
    }

    @Override
    public User changePassword(Long id, String oldPassword, String newPassword) {
        User customer = findCustomer(id);
        if (!passwordEncoder.matches(oldPassword, customer.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }
        customer.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(customer);
    }

    @Override
    public void delete(Long id) {
        User customer = findCustomer(id);
        customer.setStatus(Status.INACTIVE);
        userRepository.save(customer);
    }
}
