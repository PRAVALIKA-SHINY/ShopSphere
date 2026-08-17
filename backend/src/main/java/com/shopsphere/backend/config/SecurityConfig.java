package com.shopsphere.backend.config;

import com.shopsphere.backend.security.CustomUserDetailsService;
import com.shopsphere.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(csrf -> csrf.disable())

                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                // -------------------------------------------------
                // SESSION
                // -------------------------------------------------

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(auth -> auth

                        // =========================================
                        // PUBLIC AUTH
                        // =========================================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // =========================================
                        // PUBLIC PRODUCT APIs
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/brands/**",
                                "/api/reviews/product/**"
                        ).permitAll()

                        // =========================================
                        // PUBLIC UPLOADS
                        // =========================================

                        .requestMatchers(
                                "/uploads/**"
                        ).permitAll()

                        // =========================================
                        // PRODUCT MANAGEMENT
                        // EMPLOYEE + ADMIN
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/manage/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/upload-images"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        // =========================================
                        // EMPLOYEE MANAGEMENT
                        // ADMIN ONLY
                        // =========================================

                        .requestMatchers(
                                "/api/employees/**"
                        ).hasAuthority(
                                "ROLE_SUPER_ADMIN"
                        )

                        // =========================================
                        // ADMIN APIs
                        // ADMIN ONLY
                        // =========================================

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasAuthority(
                                "ROLE_SUPER_ADMIN"
                        )

                        // =========================================
                        // ADMIN DASHBOARD
                        // ADMIN ONLY
                        // =========================================

                        .requestMatchers(
                                "/api/dashboard/admin/**"
                        ).hasAuthority(
                                "ROLE_SUPER_ADMIN"
                        )

                        // =========================================
                        // EMPLOYEE DASHBOARD
                        // ADMIN + EMPLOYEE
                        // =========================================

                        .requestMatchers(
                                "/api/dashboard/employee/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        // =========================================
                        // ORDER MANAGEMENT
                        // ADMIN + EMPLOYEE
                        // =========================================

                        .requestMatchers(
                                "/api/orders/admin/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        // =========================================
                        // CATEGORY / BRAND MANAGEMENT
                        // ADMIN + EMPLOYEE
                        // =========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**",
                                "/api/brands/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**",
                                "/api/brands/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**",
                                "/api/brands/**"
                        ).hasAnyAuthority(
                                "ROLE_SUPER_ADMIN",
                                "ROLE_EMPLOYEE"
                        )

                        // =========================================
                        // CUSTOMER APIs
                        // CUSTOMER ONLY
                        // =========================================

                        .requestMatchers(
                                "/api/cart/**",
                                "/api/wishlist/**",
                                "/api/orders/**",
                                "/api/customers/**"
                        ).hasAuthority(
                                "ROLE_CUSTOMER"
                        )

                        // =========================================
                        // EVERYTHING ELSE
                        // =========================================

                        .anyRequest().authenticated()
                )

                // -------------------------------------------------
                // AUTHENTICATION PROVIDER
                // -------------------------------------------------

                .authenticationProvider(
                        authenticationProvider()
                )

                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        List<String> origins =
                Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.isEmpty())
                        .toList();

        configuration.setAllowedOrigins(origins);

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}