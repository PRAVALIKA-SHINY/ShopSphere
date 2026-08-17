package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.ProductDtos.ProductRequest;
import com.shopsphere.backend.dto.ProductResponse;
import com.shopsphere.backend.entity.Brand;
import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.ProductStatus;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.BrandRepository;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.FileStorageService;
import com.shopsphere.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;


    // Convert Product entity to ProductResponse DTO
    private ProductResponse toResponse(Product product) {

        List<String> images =
                product.getImages() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(product.getImages());

        return ProductResponse.builder()
                .id(product.getId())
                .code(product.getCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .stock(product.getStock())
                .images(images)
                .specifications(product.getSpecifications())

                .categoryId(
                        product.getCategory() != null
                                ? product.getCategory().getId()
                                : null
                )

                .brandId(
                        product.getBrand() != null
                                ? product.getBrand().getId()
                                : null
                )

                .createdById(
                        product.getCreatedBy() != null
                                ? product.getCreatedBy().getId()
                                : null
                )

                .active(product.getActive())
                .status(product.getStatus())
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }


    // Apply ProductRequest data to Product entity
    private void applyRequest(
            Product product,
            ProductRequest request
    ) {

        // Basic product information

        product.setName(
                request.getName()
        );

        product.setDescription(
                request.getDescription()
        );

        product.setPrice(
                request.getPrice()
        );


        // Discount

        if (request.getDiscount() != null) {

            if (
                    request.getDiscount() < 0
                            || request.getDiscount() > 100
            ) {
                throw new BadRequestException(
                        "Discount must be between 0 and 100"
                );
            }

            product.setDiscount(
                    request.getDiscount()
            );
        }


        // Stock

        if (request.getStock() != null) {

            if (request.getStock() < 0) {

                throw new BadRequestException(
                        "Stock cannot be negative"
                );
            }

            product.setStock(
                    request.getStock()
            );
        }


        // Images

        if (request.getImages() != null) {

            product.setImages(
                    new ArrayList<>(
                            request.getImages()
                    )
            );
        }


        // Specifications

        if (request.getSpecifications() != null) {

            product.setSpecifications(
                    request.getSpecifications()
            );
        }


        // Status and stock logic

        if (request.getStatus() != null) {

            product.setStatus(
                    request.getStatus()
            );
        }


        // Discontinued products cannot be automatically activated

        if (
                product.getStatus()
                        == ProductStatus.DISCONTINUED
        ) {

            product.setActive(false);

        }


        // Explicitly inactive products remain inactive

        else if (
                product.getStatus()
                        == ProductStatus.INACTIVE
        ) {

            product.setActive(false);

        }


        // Zero stock means OUT_OF_STOCK
        // OUT_OF_STOCK products remain visible to customers

        else if (
                product.getStock() != null
                        && product.getStock() == 0
        ) {

            product.setStatus(
                    ProductStatus.OUT_OF_STOCK
            );

            product.setActive(true);

        }


        // Product has stock again

        else if (
                product.getStatus()
                        == ProductStatus.OUT_OF_STOCK
        ) {

            if (
                    product.getStock() != null
                            && product.getStock() > 0
            ) {

                product.setStatus(
                        ProductStatus.ACTIVE
                );

                product.setActive(true);
            }

        }


        // Normal active product

        else {

            product.setStatus(
                    ProductStatus.ACTIVE
            );

            product.setActive(true);
        }


        // Category

        if (request.getCategoryId() != null) {

            Category category =
                    categoryRepository.findById(
                            request.getCategoryId()
                    ).orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Category not found"
                            )
                    );

            product.setCategory(
                    category
            );
        }


        // Brand

        if (request.getBrandId() != null) {

            Brand brand =
                    brandRepository.findById(
                            request.getBrandId()
                    ).orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Brand not found"
                            )
                    );

            product.setBrand(
                    brand
            );
        }
    }


    // Create a new product

    @Override
    @Transactional
    public ProductResponse create(
            ProductRequest request,
            Long employeeId
    ) {

        Product product =
                new Product();


        // Generate product code if one was not provided

        String code =
                request.getCode();

        if (
                code == null
                        || code.isBlank()
        ) {

            code =
                    "SS-"
                            + UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase();
        }


        // Check duplicate product code

        if (
                productRepository.existsByCode(code)
        ) {

            throw new BadRequestException(
                    "Product code already exists"
            );
        }

        product.setCode(code);


        // Apply request data

        applyRequest(
                product,
                request
        );


        // Set employee who created the product

        if (employeeId != null) {

            User employee =
                    userRepository.findById(
                            employeeId
                    ).orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Employee not found"
                            )
                    );

            product.setCreatedBy(
                    employee
            );
        }


        // Save product

        Product saved =
                productRepository.save(
                        product
                );

        return toResponse(
                saved
        );
    }


    // Get all active and customer-visible products

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAll(
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository
                        .findByActiveTrueAndStatusNotIn(
                                List.of(
                                        ProductStatus.INACTIVE,
                                        ProductStatus.DISCONTINUED
                                ),
                                pageable
                        );

        return products.map(
                this::toResponse
        );
    }


    // Get all products for employee/admin management

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getManageable(
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository.findAll(
                        pageable
                );

        return products.map(
                this::toResponse
        );
    }


    // Get product by ID

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(
            Long id
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        return toResponse(
                product
        );
    }


    // Get product by product code

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getByCode(
            String code
    ) {

        Product product =
                productRepository.findByCode(code)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with code: "
                                                + code
                                )
                        );

        return toResponse(
                product
        );
    }


    // Get active products by category

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByCategory(
            Long categoryId,
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository
                        .findByCategoryIdAndActiveTrueAndStatusNotIn(
                                categoryId,
                                List.of(
                                        ProductStatus.INACTIVE,
                                        ProductStatus.DISCONTINUED
                                ),
                                pageable
                        );

        return products.map(
                this::toResponse
        );
    }


    // Get active products by brand

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByBrand(
            Long brandId,
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository
                        .findByBrandIdAndActiveTrueAndStatusNotIn(
                                brandId,
                                List.of(
                                        ProductStatus.INACTIVE,
                                        ProductStatus.DISCONTINUED
                                ),
                                pageable
                        );

        return products.map(
                this::toResponse
        );
    }


    // Get products created by a specific employee

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByEmployee(
            Long employeeId,
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository.findByCreatedById(
                        employeeId,
                        pageable
                );

        return products.map(
                this::toResponse
        );
    }


    // Search customer-visible products

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> search(
            String keyword,
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository.search(
                        keyword,
                        pageable
                );

        return products.map(
                this::toResponse
        );
    }


    // Filter customer-visible products

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> filter(
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {

        Page<Product> products =
                productRepository.filter(
                        categoryId,
                        brandId,
                        minPrice,
                        maxPrice,
                        pageable
                );

        return products.map(
                this::toResponse
        );
    }


    // Update an existing product

    @Override
    @Transactional
    public ProductResponse update(
            Long id,
            ProductRequest request
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );


        // Keep the old image list before applying changes

        List<String> oldImages =
                product.getImages() == null
                        ? List.of()
                        : new ArrayList<>(
                        product.getImages()
                );


        // Apply updated product information

        applyRequest(
                product,
                request
        );


        // Save updated product

        Product saved =
                productRepository.save(
                        product
                );


        // Delete image files that were removed from the product

        if (request.getImages() != null) {

            Set<String> retained =
                    new HashSet<>(
                            request.getImages()
                    );

            oldImages.stream()
                    .filter(
                            url -> !retained.contains(url)
                    )
                    .forEach(
                            fileStorageService::deleteFile
                    );
        }


        return toResponse(
                saved
        );
    }


    // Update product stock

    @Override
    @Transactional
    public ProductResponse updateStock(
            Long id,
            Integer stock
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );


        // Validate stock

        if (
                stock == null
                        || stock < 0
        ) {

            throw new BadRequestException(
                    "Stock cannot be negative"
            );
        }

        product.setStock(
                stock
        );


        // Discontinued products remain discontinued

        if (
                product.getStatus()
                        == ProductStatus.DISCONTINUED
        ) {

            Product saved =
                    productRepository.save(
                            product
                    );

            return toResponse(
                    saved
            );
        }


        // Zero stock means OUT_OF_STOCK

        if (stock == 0) {

            product.setStatus(
                    ProductStatus.OUT_OF_STOCK
            );

            product.setActive(true);
        }


        // Stock is available

        else {

            // Automatically reactivate a product
            // that was only out of stock

            if (
                    product.getStatus()
                            == ProductStatus.OUT_OF_STOCK
            ) {

                product.setStatus(
                        ProductStatus.ACTIVE
                );
            }


            // Keep explicitly inactive products inactive

            product.setActive(
                    product.getStatus()
                            != ProductStatus.INACTIVE
                            && product.getStatus()
                            != ProductStatus.DISCONTINUED
            );
        }


        Product saved =
                productRepository.save(
                        product
                );

        return toResponse(
                saved
        );
    }


    // Update product discount

    @Override
    @Transactional
    public ProductResponse updateDiscount(
            Long id,
            Double discount
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );


        // Validate discount

        if (
                discount == null
                        || discount < 0
                        || discount > 100
        ) {

            throw new BadRequestException(
                    "Discount must be between 0 and 100"
            );
        }

        product.setDiscount(
                discount
        );


        Product saved =
                productRepository.save(
                        product
                );

        return toResponse(
                saved
        );
    }


    // Activate product

    @Override
    @Transactional
    public void activate(
            Long id
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );


        // Discontinued products cannot be activated

        if (
                product.getStatus()
                        == ProductStatus.DISCONTINUED
        ) {

            throw new BadRequestException(
                    "Discontinued products cannot be activated"
            );
        }


        // Determine status from current stock

        if (
                product.getStock() != null
                        && product.getStock() == 0
        ) {

            product.setStatus(
                    ProductStatus.OUT_OF_STOCK
            );

        } else {

            product.setStatus(
                    ProductStatus.ACTIVE
            );
        }

        product.setActive(
                true
        );

        productRepository.save(
                product
        );
    }


    // Deactivate product

    @Override
    @Transactional
    public void deactivate(
            Long id
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        product.setActive(
                false
        );

        product.setStatus(
                ProductStatus.INACTIVE
        );

        productRepository.save(
                product
        );
    }


    // Soft delete product

    @Override
    @Transactional
    public void delete(
            Long id
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );


        // Soft delete.
        // The database record and image references remain.
        // The product is simply hidden from customers.

        product.setActive(
                false
        );

        product.setStatus(
                ProductStatus.INACTIVE
        );

        productRepository.save(
                product
        );
    }
}