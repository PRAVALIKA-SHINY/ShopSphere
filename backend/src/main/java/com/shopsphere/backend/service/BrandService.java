package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Brand;

import java.util.List;

public interface BrandService {
    Brand create(Brand brand);
    List<Brand> getAll();
    Brand getById(Long id);
    Brand update(Long id, Brand updated);
    void delete(Long id);
}
