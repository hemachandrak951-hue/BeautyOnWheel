package com.beautyonwheel.controller;

import com.beautyonwheel.dto.UserLoginRequest;
import com.beautyonwheel.dto.UserProfileResponse;
import com.beautyonwheel.dto.UserRegistrationRequest;
import com.beautyonwheel.dto.AuthTokenResponse;
import com.beautyonwheel.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user
     * 
     * @param request User registration details
     * @return 201 Created with user profile
     */
    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        log.info("Processing registration request for email: {}", request.getEmail());
        
        UserProfileResponse response = authService.register(request);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    /**
     * Login user and return JWT token
     * 
     * @param request Login credentials (email/phone and password)
     * @return 200 OK with access token and user profile
     */
    @PostMapping("/login")
    public ResponseEntity<AuthTokenResponse> login(@Valid @RequestBody UserLoginRequest request) {
        log.info("Processing login request for identifier: {}", request.getIdentifier());
        
        AuthTokenResponse response = authService.login(request);
        
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(response);
    }
}
