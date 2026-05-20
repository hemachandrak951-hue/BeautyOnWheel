package com.beautyonwheel.dto;

import com.beautyonwheel.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User Data Transfer Object for API responses
 * Excludes sensitive information like password hash
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    private String name;

    private String email;

    private String phone;

    @JsonProperty("date_of_birth")
    private LocalDate dateOfBirth;

    private String role;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Convert User entity to UserDTO
     * 
     * @param user The User entity
     * @return UserDTO instance
     */
    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .dateOfBirth(user.getDateOfBirth())
            .role(user.getRole().toString())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
