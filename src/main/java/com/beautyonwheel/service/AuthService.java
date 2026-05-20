package com.beautyonwheel.service;

import com.beautyonwheel.dto.*;
import com.beautyonwheel.entity.User;
import com.beautyonwheel.exception.DuplicateResourceException;
import com.beautyonwheel.exception.ResourceNotFoundException;
import com.beautyonwheel.repository.UserRepository;
import com.beautyonwheel.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public UserProfileResponse register(UserRegistrationRequest request) {
        // Validate duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with duplicate email: {}", request.getEmail());
            throw new DuplicateResourceException("Email already registered");
        }

        // Validate duplicate phone
        if (userRepository.existsByPhone(request.getPhone())) {
            log.warn("Registration attempt with duplicate phone: {}", request.getPhone());
            throw new DuplicateResourceException("Phone number already registered");
        }

        try {
            // Create new user entity
            User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.UserRole.valueOf(request.getRole()))
                .build();

            // Save to database
            User savedUser = userRepository.save(user);
            log.info("User registered successfully with email: {}", savedUser.getEmail());

            return UserProfileResponse.fromEntity(savedUser);
        } catch (IllegalArgumentException e) {
            log.error("Invalid role specified: {}", request.getRole());
            throw new IllegalArgumentException("Invalid user role");
        }
    }

    @Transactional(readOnly = true)
    public AuthTokenResponse login(UserLoginRequest request) {
        // Find user by email or phone
        User user = userRepository.findByEmailOrPhone(request.getIdentifier(), request.getIdentifier())
            .orElseThrow(() -> {
                log.warn("Login attempt with non-existent identifier: {}", request.getIdentifier());
                return new ResourceNotFoundException("User not found");
            });

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt for user: {}", user.getEmail());
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Generate JWT token
        String accessToken = jwtTokenProvider.generateToken(
            user.getEmail(),
            user.getId().toString(),
            user.getRole().toString()
        );

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthTokenResponse.builder()
            .accessToken(accessToken)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getTokenExpirationTime() / 1000) // Convert to seconds
            .user(UserProfileResponse.fromEntity(user))
            .build();
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
