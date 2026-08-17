package com.shopsphere.backend.config;

import com.shopsphere.backend.entity.Brand;
import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.Role;
import com.shopsphere.backend.enums.Status;
import com.shopsphere.backend.repository.BrandRepository;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds only the default Super Admin,
 * Categories and Brands.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        seedSuperAdmin();

        seedCategories();

        seedBrands();
    }

    /**
     * ============================================================
     * SUPER ADMIN
     * ============================================================
     */
    private void seedSuperAdmin() {

        if (!userRepository.existsByEmail("admin@shopsphere.com")) {

            userRepository.save(
                    User.builder()
                            .name("Super Admin")
                            .email("admin@shopsphere.com")
                            .password(
                                    passwordEncoder.encode("Admin@123")
                            )
                            .role(Role.SUPER_ADMIN)
                            .status(Status.ACTIVE)
                            .build()
            );

            System.out.println(
                    ">>> Seeded Super Admin -> admin@shopsphere.com / Admin@123"
            );
        }
    }

    /**
     * ============================================================
     * CATEGORIES
     * ============================================================
     *
     * These are seeded only when the category table is empty.
     *
     * NO PRODUCTS ARE CREATED HERE.
     */
    private void seedCategories() {

        if (categoryRepository.count() > 0) {
            return;
        }

        categoryRepository.save(
                Category.builder()
                        .name("Women")
                        .description("Women's fashion")
                        .active(true)
                        .build()
        );

        categoryRepository.save(
                Category.builder()
                        .name("Men")
                        .description("Men's fashion")
                        .active(true)
                        .build()
        );

        categoryRepository.save(
                Category.builder()
                        .name("Accessories")
                        .description("Bags, jewelry & more")
                        .active(true)
                        .build()
        );

        categoryRepository.save(
                Category.builder()
                        .name("Footwear")
                        .description("Shoes & sneakers")
                        .active(true)
                        .build()
        );

        System.out.println(
                ">>> Seeded categories: 4"
        );
    }

    /**
     * ============================================================
     * BRANDS
     * ============================================================
     *
     * These are seeded only when the brand table is empty.
     *
     * NO PRODUCTS ARE CREATED HERE.
     */
    private void seedBrands() {

        if (brandRepository.count() > 0) {
            return;
        }

        brandRepository.save(
                Brand.builder()
                        .name("ShopSphere Label")
                        .description("In-house brand")
                        .active(true)
                        .build()
        );

        brandRepository.save(
                Brand.builder()
                        .name("Urban Edge")
                        .description("Streetwear essentials")
                        .active(true)
                        .build()
        );

        System.out.println(
                ">>> Seeded brands: 2"
        );
    }
}