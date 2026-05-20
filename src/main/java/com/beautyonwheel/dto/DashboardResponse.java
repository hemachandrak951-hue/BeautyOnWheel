package com.beautyonwheel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.List;

/**
 * Dashboard Response DTO combining user profile and services catalog
 * Follows Amazon/Flipkart-style listing with categories
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    @JsonProperty("user_profile")
    private UserDTO userProfile;

    @JsonProperty("services_catalog")
    private Map<String, List<ServiceItemDTO>> servicesCatalog;

    @JsonProperty("status")
    @Builder.Default
    private String status = "success";

    @JsonProperty("timestamp")
    @Builder.Default
    private Long timestamp = System.currentTimeMillis();
}
