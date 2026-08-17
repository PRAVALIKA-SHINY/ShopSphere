package com.shopsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public static ApiResponse of(boolean success, String message) {
        return new ApiResponse(success, message, null);
    }

    public static ApiResponse of(boolean success, String message, Object data) {
        return new ApiResponse(success, message, data);
    }
}
