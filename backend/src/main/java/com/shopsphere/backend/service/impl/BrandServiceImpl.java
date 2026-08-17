package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.Brand;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.BrandRepository;
import com.shopsphere.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public Brand create(Brand brand) {
        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new BadRequestException("Brand already exists");
        }
        return brandRepository.save(brand);
    }

    @Override
    public List<Brand> getAll() {
        return brandRepository.findAll();
    }

    @Override
    public Brand getById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
    }

    @Override
    public Brand update(Long id, Brand updated) {
        Brand brand = getById(id);
        brand.setName(updated.getName());
        brand.setDescription(updated.getDescription());
        if (updated.getLogo() != null) brand.setLogo(updated.getLogo());
        return brandRepository.save(brand);
    }

    @Override
    public void delete(Long id) {
        brandRepository.delete(getById(id));
    }
}
