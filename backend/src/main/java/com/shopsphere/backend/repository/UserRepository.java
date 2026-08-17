package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findByPasswordResetToken(String passwordResetToken);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByRoleAndStatus(Role role, Status status);
    List<User> findByStatus(Status status);
    Page<User> findByRoleAndNameContainingIgnoreCase(Role role, String name, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
}
