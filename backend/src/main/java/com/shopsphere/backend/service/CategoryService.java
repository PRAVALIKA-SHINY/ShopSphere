package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Category;

import java.util.List;

public interface CategoryService {
    Category create(Category category);
    List<Category> getAll();
    Category getById(Long id);
    Category update(Long id, Category updated);
    void delete(Long id);
}
