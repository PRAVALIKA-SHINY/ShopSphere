package com.shopsphere.backend.security;

import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Status;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    // =========================================================
    // USER
    // =========================================================

    public User getUser() {
        return user;
    }

    // =========================================================
    // USER ID
    // =========================================================

    public Long getId() {
        return user.getId();
    }

    // =========================================================
    // ROLE / AUTHORITIES
    // =========================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        if (user == null || user.getRole() == null) {
            System.out.println("USER OR ROLE IS NULL");
            return Collections.emptyList();
        }

        String authority = "ROLE_" + user.getRole().name();

        System.out.println(
                "========================================"
        );

        System.out.println(
                "AUTHENTICATED USER: " + user.getEmail()
        );

        System.out.println(
                "DATABASE ROLE: " + user.getRole().name()
        );

        System.out.println(
                "SPRING AUTHORITY: " + authority
        );

        System.out.println(
                "USER STATUS: " + user.getStatus()
        );

        System.out.println(
                "========================================"
        );

        return Collections.singletonList(
                new SimpleGrantedAuthority(authority)
        );
    }

    // =========================================================
    // PASSWORD
    // =========================================================

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // =========================================================
    // USERNAME
    // =========================================================

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // =========================================================
    // ACCOUNT STATUS
    // =========================================================

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        return user.getStatus() != Status.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {

        return user.getStatus() == Status.ACTIVE;
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    public String getRole() {

        if (user == null || user.getRole() == null) {
            return null;
        }

        return user.getRole().name();
    }

    public Status getStatus() {
        return user.getStatus();
    }
}