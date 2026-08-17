package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ApiResponse;
import com.shopsphere.backend.dto.ProductDtos.*;
import com.shopsphere.backend.dto.ProductResponse;
import com.shopsphere.backend.security.UserPrincipal;
import com.shopsphere.backend.service.FileStorageService;
import com.shopsphere.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    private final FileStorageService fileStorageService;


    // PAGINATION + SORTING

    private PageRequest page(
            int page,
            int size,
            String sort
    ) {

        if ("priceAsc".equalsIgnoreCase(sort)) {

            return PageRequest.of(
                    page,
                    size,
                    Sort.by(
                            Sort.Direction.ASC,
                            "price"
                    )
            );
        }

        if ("priceDesc".equalsIgnoreCase(sort)) {

            return PageRequest.of(
                    page,
                    size,
                    Sort.by(
                            Sort.Direction.DESC,
                            "price"
                    )
            );
        }

        if ("newest".equalsIgnoreCase(sort)) {

            return PageRequest.of(
                    page,
                    size,
                    Sort.by(
                            Sort.Direction.DESC,
                            "createdAt"
                    )
            );
        }

        return PageRequest.of(
                page,
                size
        );
    }


    // UPLOAD PRODUCT IMAGES

    @PostMapping(
            value = "/upload-images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse> uploadImages(
            @RequestParam("files")
            MultipartFile[] files
    ) {

        List<String> imageUrls =
                fileStorageService
                        .storeProductImages(files);

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product images uploaded successfully",
                        imageUrls
                )
        );
    }


    // CREATE PRODUCT

    @PostMapping
    public ResponseEntity<ApiResponse> create(
            @Valid
            @RequestBody ProductRequest request,

            @AuthenticationPrincipal
            UserPrincipal principal
    ) {

        Long employeeId =
                principal != null
                        ? principal.getId()
                        : null;

        ProductResponse response =
                productService.create(
                        request,
                        employeeId
                );

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product created",
                        response
                )
        );
    }


    // MANAGE PRODUCTS

    @GetMapping("/manage")
    public ResponseEntity<ApiResponse> manage(
            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "50")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.getManageable(
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }

    // GET ALL ACTIVE PRODUCTS

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.getAll(
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }


    // GET PRODUCT BY ID

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product fetched",
                        productService.getById(id)
                )
        );
    }


    // GET PRODUCT BY CODE

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse> getByCode(
            @PathVariable String code
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product fetched",
                        productService.getByCode(code)
                )
        );
    }


    // GET PRODUCTS BY CATEGORY

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> getByCategory(
            @PathVariable Long categoryId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.getByCategory(
                                categoryId,
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }


    // GET PRODUCTS BY BRAND

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse> getByBrand(
            @PathVariable Long brandId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.getByBrand(
                                brandId,
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }


    // GET PRODUCTS BY EMPLOYEE

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse> getByEmployee(
            @PathVariable Long employeeId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.getByEmployee(
                                employeeId,
                                PageRequest.of(
                                        page,
                                        size
                                )
                        )
                )
        );
    }


    // SEARCH PRODUCTS

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(
            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.search(
                                keyword,
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }


    // FILTER PRODUCTS

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> filter(
            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            Long brandId,

            @RequestParam(required = false)
            BigDecimal minPrice,

            @RequestParam(required = false)
            BigDecimal maxPrice,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "12")
            int size,

            @RequestParam(required = false)
            String sort
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Products fetched",
                        productService.filter(
                                categoryId,
                                brandId,
                                minPrice,
                                maxPrice,
                                page(
                                        page,
                                        size,
                                        sort
                                )
                        )
                )
        );
    }


    // UPDATE PRODUCT

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(
            @PathVariable Long id,

            @Valid
            @RequestBody ProductRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product updated",
                        productService.update(
                                id,
                                request
                        )
                )
        );
    }


    // UPDATE PRODUCT STOCK

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse> updateStock(
            @PathVariable Long id,

            @Valid
            @RequestBody StockUpdateRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Stock updated",
                        productService.updateStock(
                                id,
                                request.getStock()
                        )
                )
        );
    }


    // UPDATE PRODUCT DISCOUNT

    @PatchMapping("/{id}/discount")
    public ResponseEntity<ApiResponse> updateDiscount(
            @PathVariable Long id,

            @Valid
            @RequestBody DiscountUpdateRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Discount updated",
                        productService.updateDiscount(
                                id,
                                request.getDiscount()
                        )
                )
        );
    }


    // ACTIVATE PRODUCT

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse> activate(
            @PathVariable Long id
    ) {

        productService.activate(id);

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product activated"
                )
        );
    }


    // DEACTIVATE PRODUCT

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivate(
            @PathVariable Long id
    ) {

        productService.deactivate(id);

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product deactivated"
                )
        );
    }


    // DELETE PRODUCT

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            @PathVariable Long id
    ) {

        productService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Product deleted"
                )
        );
    }
}