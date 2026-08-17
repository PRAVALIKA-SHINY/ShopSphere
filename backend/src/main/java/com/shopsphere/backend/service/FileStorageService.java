package com.shopsphere.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {

    List<String> storeProductImages(MultipartFile[] files);

    void deleteFile(String imageUrl);
}