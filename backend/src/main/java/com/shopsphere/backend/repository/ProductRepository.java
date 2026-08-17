package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);
    boolean existsByCode(String code);

    Page<Product> findByCategoryIdAndActiveTrueAndStatusNotIn(Long categoryId, java.util.Collection<ProductStatus> statuses, Pageable pageable);
    Page<Product> findByBrandIdAndActiveTrueAndStatusNotIn(Long brandId, java.util.Collection<ProductStatus> statuses, Pageable pageable);
    Page<Product> findByCreatedById(Long employeeId, Pageable pageable);
    Page<Product> findByActiveTrueAndStatusNotIn(java.util.Collection<ProductStatus> statuses, Pageable pageable);
    long countByActiveTrueAndStatusNotIn(java.util.Collection<ProductStatus> statuses);
    long countByStatus(ProductStatus status);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true AND p.status NOT IN :statuses AND p.stock IS NOT NULL AND p.stock <= :maxStock")
    long countLowStock(@Param("statuses") java.util.Collection<ProductStatus> statuses, @Param("maxStock") Integer maxStock);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.status <> com.shopsphere.backend.enums.ProductStatus.INACTIVE AND p.status <> com.shopsphere.backend.enums.ProductStatus.DISCONTINUED AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> search(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.status <> com.shopsphere.backend.enums.ProductStatus.INACTIVE AND p.status <> com.shopsphere.backend.enums.ProductStatus.DISCONTINUED " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> filter(@Param("categoryId") Long categoryId,
                          @Param("brandId") Long brandId,
                          @Param("minPrice") java.math.BigDecimal minPrice,
                          @Param("maxPrice") java.math.BigDecimal maxPrice,
                          Pageable pageable);
}
