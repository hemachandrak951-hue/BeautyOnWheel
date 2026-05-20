package com.beautyonwheel.exception;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handle validation errors from @Valid annotations
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request) {

        log.warn("Validation error occurred");

        Map<String, List<String>> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error ->
            fieldErrors.computeIfAbsent(error.getField(), k -> new java.util.ArrayList<>())
                .add(error.getDefaultMessage())
        );

        ex.getBindingResult().getGlobalErrors().forEach(error ->
            fieldErrors.computeIfAbsent("global", k -> new java.util.ArrayList<>())
                .add(error.getDefaultMessage())
        );

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            "Invalid input parameters",
            getRequestPath(request),
            fieldErrors
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle duplicate resource exceptions
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateResourceException(
        DuplicateResourceException ex,
        WebRequest request) {

        log.warn("Duplicate resource error: {}", ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            "Resource already exists",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * Handle resource not found exceptions
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(
        ResourceNotFoundException ex,
        WebRequest request) {

        log.warn("Resource not found: {}", ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            "Resource not found",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle invalid argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(
        IllegalArgumentException ex,
        WebRequest request) {

        log.warn("Invalid argument: {}", ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            "Invalid input",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle JWT exceptions (invalid or expired tokens)
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(
        JwtException ex,
        WebRequest request) {

        log.warn("JWT validation error: {}", ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.UNAUTHORIZED.value(),
            "Invalid or expired authentication token",
            "JWT token validation failed",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle access denied exceptions (insufficient permissions)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(
        AccessDeniedException ex,
        WebRequest request) {

        log.warn("Access denied: {}", ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.FORBIDDEN.value(),
            "Access denied - insufficient permissions",
            "You do not have permission to access this resource",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * Handle illegal state exceptions (user not authenticated)
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(
        IllegalStateException ex,
        WebRequest request) {

        log.warn("Illegal state: {}", ex.getMessage());

        // Return 401 for authentication-related state exceptions
        if (ex.getMessage() != null && ex.getMessage().contains("authenticated")) {
            ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "Authentication required",
                "User is not authenticated",
                getRequestPath(request)
            );
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            "Invalid application state",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(
        Exception ex,
        WebRequest request) {

        log.error("An unexpected error occurred", ex);

        ApiErrorResponse response = ApiErrorResponse.of(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            "Internal server error",
            getRequestPath(request)
        );

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String getRequestPath(WebRequest request) {
        String path = request.getDescription(false);
        return path.startsWith("uri=") ? path.substring(4) : path;
    }
}
