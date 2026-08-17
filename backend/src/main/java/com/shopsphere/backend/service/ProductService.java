package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.ProductDtos.ProductRequest;
import com.shopsphere.backend.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {



    ProductResponse create(
            ProductRequest request,
            Long employeeId
    );



    Page<ProductResponse> getAll(
            Pageable pageable
    );



    Page<ProductResponse> getManageable(
            Pageable pageable
    );



    ProductResponse getById(
            Long id
    );



    ProductResponse getByCode(
            String code
    );



    Page<ProductResponse> getByCategory(
            Long categoryId,
            Pageable pageable
    );



    Page<ProductResponse> getByBrand(
            Long brandId,
            Pageable pageable
    );



    Page<ProductResponse> getByEmployee(
            Long employeeId,
            Pageable pageable
    );



    Page<ProductResponse> search(
            String keyword,
            Pageable pageable
    );




    Page<ProductResponse> filter(
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );



    ProductResponse update(
            Long id,
            ProductRequest request
    );



    ProductResponse updateStock(
            Long id,
            Integer stock
    );



    ProductResponse updateDiscount(
            Long id,
            Double discount
    );



    void activate(
            Long id
    );



    void deactivate(
            Long id
    );



    void delete(
            Long id
    );
}