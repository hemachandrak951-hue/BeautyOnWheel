package com.beautyonwheel.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {

    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, List<String>> fieldErrors;

    public static ApiErrorResponse of(int status, String message, String error, String path) {
        return ApiErrorResponse.builder()
            .status(status)
            .message(message)
            .error(error)
            .timestamp(LocalDateTime.now())
            .path(path)
            .build();
    }

    public static ApiErrorResponse of(int status, String message, String error, String path, Map<String, List<String>> fieldErrors) {
        return ApiErrorResponse.builder()
            .status(status)
            .message(message)
            .error(error)
            .timestamp(LocalDateTime.now())
            .path(path)
            .fieldErrors(fieldErrors)
            .build();
    }
}
