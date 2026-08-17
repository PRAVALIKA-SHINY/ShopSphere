package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category create(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new BadRequestException("Category already exists");
        }
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public Category update(Long id, Category updated) {
        Category category = getById(id);
        category.setName(updated.getName());
        category.setDescription(updated.getDescription());
        if (updated.getImage() != null) category.setImage(updated.getImage());
        return categoryRepository.save(category);
    }

    @Override
    public void delete(Long id) {
        categoryRepository.delete(getById(id));
    }
}
