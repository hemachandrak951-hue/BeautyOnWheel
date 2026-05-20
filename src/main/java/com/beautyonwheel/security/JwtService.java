package com.beautyonwheel.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Service for JWT token validation and claims extraction
 * Provides centralized validation for all JWT operations across the application
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    @Value("${app.jwt.secret:your-super-secret-key-min-32-characters-required-for-security}")
    private String jwtSecret;

    /**
     * Get the signing key for JWT operations
     * 
     * @return SecretKey for HMAC operations
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Validate a JWT token and extract all claims
     * 
     * @param token The JWT token string
     * @return Claims if token is valid
     * @throws JwtException if token is invalid or expired
     */
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Extract username (email) from token
     * 
     * @param token The JWT token string
     * @return Username from token subject
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract user ID from token claims
     * 
     * @param token The JWT token string
     * @return User ID from token
     */
    public String extractUserId(String token) {
        return (String) extractAllClaims(token).get("userId");
    }

    /**
     * Extract role from token claims
     * 
     * @param token The JWT token string
     * @return Role from token
     */
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    /**
     * Check if token is expired
     * 
     * @param token The JWT token string
     * @return true if token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new java.util.Date());
        } catch (JwtException e) {
            log.warn("Token expiration check failed: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Validate token and check expiration
     * 
     * @param token The JWT token string
     * @return true if token is valid and not expired
     */
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * Extract Bearer token from Authorization header
     * 
     * @param authorizationHeader The Authorization header value
     * @return Token string without "Bearer " prefix, or null if invalid format
     */
    public String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
