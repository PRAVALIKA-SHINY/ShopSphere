package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024;

    private static final int MAX_IMAGES_PER_PRODUCT = 5;

    private static final List<String> ALLOWED_EXTENSIONS =
            List.of(
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
            );

    private static final List<String> ALLOWED_CONTENT_TYPES =
            List.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );


    // STORE PRODUCT IMAGES

    @Override
    public List<String> storeProductImages(
            MultipartFile[] files
    ) {

        if (
                files == null
                        || files.length == 0
        ) {

            throw new BadRequestException(
                    "Please select at least one image"
            );
        }


        // MAXIMUM IMAGE LIMIT

        if (
                files.length
                        > MAX_IMAGES_PER_PRODUCT
        ) {

            throw new BadRequestException(
                    "You can upload a maximum of "
                            + MAX_IMAGES_PER_PRODUCT
                            + " images per product"
            );
        }


        // PRODUCT IMAGE DIRECTORY

        Path productDirectory =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize()
                        .resolve("products")
                        .normalize();


        // CREATE DIRECTORY IF NEEDED

        try {

            Files.createDirectories(
                    productDirectory
            );

        } catch (IOException e) {

            throw new BadRequestException(
                    "Could not create product image directory"
            );
        }


        List<String> uploadedImages =
                new ArrayList<>();


        // PROCESS EACH IMAGE

        for (MultipartFile file : files) {


            // CHECK EMPTY FILE

            if (
                    file == null
                            || file.isEmpty()
            ) {

                throw new BadRequestException(
                        "One of the selected images is empty"
                );
            }


            // CHECK FILE SIZE

            if (
                    file.getSize()
                            > MAX_FILE_SIZE
            ) {

                throw new BadRequestException(
                        "Each image must be smaller than 5 MB"
                );
            }


            // GET ORIGINAL FILENAME

            String originalFilename =
                    file.getOriginalFilename();


            if (
                    !StringUtils.hasText(
                            originalFilename
                    )
            ) {

                throw new BadRequestException(
                        "Invalid image filename"
                );
            }


            // GET FILE EXTENSION

            String extension =
                    getExtension(
                            originalFilename
                    ).toLowerCase();


            // CHECK FILE EXTENSION

            if (
                    !ALLOWED_EXTENSIONS.contains(
                            extension
                    )
            ) {

                throw new BadRequestException(
                        "Only JPG, JPEG, PNG and WEBP images are allowed"
                );
            }


            // CHECK CONTENT TYPE

            String contentType =
                    file.getContentType();


            if (
                    contentType == null
                            || !ALLOWED_CONTENT_TYPES.contains(
                            contentType.toLowerCase()
                    )
            ) {

                throw new BadRequestException(
                        "Invalid image file type"
                );
            }


            // GENERATE UNIQUE FILE NAME

            String filename =
                    UUID.randomUUID()
                            .toString()
                            + "."
                            + extension;


            // CREATE DESTINATION PATH

            Path destination =
                    productDirectory
                            .resolve(filename)
                            .normalize();


            // PATH TRAVERSAL PROTECTION

            if (
                    !destination.startsWith(
                            productDirectory
                    )
            ) {

                throw new BadRequestException(
                        "Invalid image destination"
                );
            }


            // SAVE IMAGE

            try (
                    InputStream inputStream =
                            file.getInputStream()
            ) {

                Files.copy(
                        inputStream,
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );

            } catch (IOException e) {

                throw new BadRequestException(
                        "Failed to save image: "
                                + originalFilename
                );
            }


            // CREATE PUBLIC IMAGE URL

            uploadedImages.add(
                    "/uploads/products/"
                            + filename
            );
        }


        return uploadedImages;
    }


    // DELETE PRODUCT IMAGE

    @Override
    public void deleteFile(
            String imageUrl
    ) {

        // IGNORE EMPTY URL

        if (
                !StringUtils.hasText(
                        imageUrl
                )
        ) {

            return;
        }


        // ONLY DELETE PRODUCT UPLOADS

        if (
                !imageUrl.startsWith(
                        "/uploads/products/"
                )
        ) {

            return;
        }


        try {

            // EXTRACT FILE NAME

            String filename =
                    imageUrl.substring(
                            imageUrl.lastIndexOf("/")
                                    + 1
                    );


            // VALIDATE FILE NAME

            if (
                    !StringUtils.hasText(
                            filename
                    )
                            || filename.contains("..")
                            || filename.contains("/")
                            || filename.contains("\\")
            ) {

                return;
            }


            // GET PRODUCT DIRECTORY

            Path productDirectory =
                    Paths.get(uploadDir)
                            .toAbsolutePath()
                            .normalize()
                            .resolve("products")
                            .normalize();


            // GET FILE PATH

            Path file =
                    productDirectory
                            .resolve(filename)
                            .normalize();


            // PATH TRAVERSAL PROTECTION

            if (
                    !file.startsWith(
                            productDirectory
                    )
            ) {

                return;
            }


            // DELETE FILE

            Files.deleteIfExists(file);

        } catch (Exception ignored) {

            // IGNORE DELETE FAILURE

            // Image deletion should not break
            // the product update operation.
        }
    }


    // GET FILE EXTENSION

    private String getExtension(
            String filename
    ) {

        int lastDot =
                filename.lastIndexOf(".");


        if (
                lastDot == -1
                        || lastDot
                        == filename.length() - 1
        ) {

            throw new BadRequestException(
                    "Image must have a valid extension"
            );
        }


        return filename.substring(
                lastDot + 1
        );
    }
}