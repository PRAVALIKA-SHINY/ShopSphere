package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.User;

public interface CustomerService {
    User getProfile(Long id);
    User updateProfile(Long id, User updated);
    User changePassword(Long id, String oldPassword, String newPassword);
    void delete(Long id);
}
